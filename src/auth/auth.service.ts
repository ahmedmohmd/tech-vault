import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { BcryptService } from "../bcrypt/bcrypt.service";
import { FileUploadService } from "../file-upload/file-upload.service";
import { MailService } from "../mail/mail.service";
import { NotificationsService } from "../notifications/notifications.service";
import { UsersService } from "../users/users.service";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { RandomTokenService } from "./random-token.service";
import { IGoogleUser } from "./types/google-user";

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly bcryptService: BcryptService,
		private readonly mailService: MailService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly randomTokenService: RandomTokenService,
		private readonly fileUploadService: FileUploadService,
		private readonly notificationsService: NotificationsService,
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
	) {}

	public async signUpWithCredentials(
		userData: SignUpDto,
		userImage: Express.Multer.File
	) {
		this.logger.info(
			`signUpWithCredentials called with email: ${userData.email}`
		);

		const customUserData = Object.assign(userData, {
			password: await this.bcryptService.hashPassword(userData.password),
			verificationToken: this.randomTokenService.generateRandomToken(
				this.configService.get<number>("VERIFICATION_TOKEN_LENGTH")
			),
		});

		const isUserExists = await this.usersService.isUserExists(userData.email);

		if (isUserExists) {
			this.logger.warn(`User with email ${userData.email} already exists`);
			throw new BadRequestException("User already Exists.");
		}

		this.logger.info(
			`User with email ${userData.email} does not exist, proceeding with creation`
		);

		const uploadedImage = await this.fileUploadService.uploadImage({
			file: userImage,
			path: "e-commerce/images/users-images",
		});
		this.logger.info(
			`Image uploaded successfully: ${uploadedImage?.secure_url}`
		);

		const createdUser = await this.usersService.createUser(customUserData, {
			url: uploadedImage?.secure_url,
			imagePublicId: uploadedImage?.public_id,
		});
		this.logger.info(`User created successfully with ID: ${createdUser.id}`);

		const mailOptions = {
			from: this.configService.get<string>("MAIL_USERNAME"),
			to: userData.email,
			subject: "Verify Email",
			template: "./email-verification",
			context: {
				firstName: createdUser.firstName,
				lastName: createdUser.lastName,
				verificationToken: createdUser.verificationToken,
			},
		};

		await this.mailService.sendMail(mailOptions);
		this.logger.info(`Verification email sent to ${userData.email}`);

		const payload = {
			userId: createdUser.id,
		};

		const jwtToken = await this.jwtService.sign(payload);
		const refreshToken = await this.jwtService.sign(payload, {
			expiresIn: "7d",
		});
		this.logger.info(
			`JWT and refresh tokens generated for user ID: ${createdUser.id}`
		);

		await this.notificationsService.createNotification(createdUser.id, {
			message: "Welcome in Tech Vault.",
		});

		const welcomeMessageMailOptions = {
			from: this.configService.get<string>("MAIL_USERNAME"),
			to: userData.email,
			subject: "Welcome Message",
			template: "./welcome-message",
			context: {
				homePageUrl: this.configService.get<string>("FRONT_END_ENDPOINT"),
				userName: `${userData.firstName} ${userData.lastName}`,
			},
		};

		await this.mailService.sendMail(welcomeMessageMailOptions);
		this.logger.info(`Welcome email sent to ${userData.email}`);

		return {
			jwtToken,
			jwtRefreshToken: refreshToken,
		};
	}
	public async signIn({ email, password }: SignInDto) {
		this.logger.info(`signIn called with email: ${email}`);

		const targetUser = await this.usersService.findUserByEmail(email);

		if (!targetUser) {
			this.logger.warn(`User with email ${email} does not exist`);
			throw new NotFoundException("User doesn't exists.");
		}

		const isCorrectPassword = await this.bcryptService.comparePassword(
			password,
			targetUser.password
		);

		if (!isCorrectPassword) {
			this.logger.warn(
				`Incorrect password attempt for user with email: ${email}`
			);
			await this.notificationsService.createNotification(targetUser.id, {
				message: "There are other User trying to login your account.",
			});
			this.logger.info(
				`Danger notification created for user ID: ${targetUser.id}`
			);

			const dangerMailOptions = {
				from: this.configService.get<string>("MAIL_USERNAME"),
				to: targetUser.emails.find((email) => email.isPrimary)?.email,
				subject: "Auth Danger",
				template: "./user-login-danger",
				context: {
					changePasswordUrl: `${this.configService.get<string>("FRONT_END_ENDPOINT")}/password-reset-request`,
				},
			};

			await this.mailService.sendMail(dangerMailOptions);
			this.logger.info(
				`Danger email sent to ${targetUser.emails.find((email) => email.isPrimary)?.email}`
			);

			throw new BadRequestException("Password is incorrect.");
		}

		const payload = {
			userId: targetUser.id,
		};

		const jwtToken = await this.jwtService.sign(payload);
		const refreshToken = await this.jwtService.sign(payload, {
			expiresIn: "7d",
		});
		this.logger.info(
			`JWT and refresh tokens generated for user ID: ${targetUser.id}`
		);

		return {
			jwtToken,
			jwtRefreshToken: refreshToken,
		};
	}

	public async verifyEmail(verificationToken: string) {
		this.logger.info(`verifyEmail called with token: ${verificationToken}`);
		const targetUser =
			await this.usersService.findUserByVerificationToken(verificationToken);

		if (!targetUser) {
			this.logger.warn(
				`User with verification token ${verificationToken} not found`
			);
			throw new NotFoundException("User not Found.");
		}

		this.logger.info(`User with ID: ${targetUser.id} verified successfully`);

		await this.usersService.updateUser(targetUser.id, {
			verificationToken: null,
			verified: true,
		});

		await this.notificationsService.createNotification(targetUser.id, {
			message: "Your Email are Verified Now.",
		});

		const emailVerifiedMailOption = {
			from: this.configService.get<string>("MAIL_USERNAME"),
			to: targetUser.emails.find((email) => email.isPrimary)?.email,
			subject: "Email Verification Succeeded",
			template: "./email-verified",
			context: {
				homePageUrl: this.configService.get<string>("FRONT_END_ENDPOINT"),
			},
		};

		await this.mailService.sendMail(emailVerifiedMailOption);
		this.logger.info(
			`Email verification success email sent to ${targetUser.emails.find((email) => email.isPrimary)?.email}`
		);

		return;
	}

	public async authWithGoogle(
		{ email, firstName, lastName, picture }: IGoogleUser,
		res: Response
	) {
		this.logger.info(`authWithGoogle called with email: ${email}`);
		const isUserExists = await this.usersService.isUserExists(email);

		if (isUserExists) {
			this.logger.info(`User with email ${email} exists, generating JWT`);
			const targetUser = await this.usersService.findUserByEmail(email);

			const payload = {
				userId: targetUser.id,
			};

			const jwtToken = await this.jwtService.sign(payload);

			return res.redirect(
				`${this.configService.get<string>("FRONT_END_ENDPOINT")}/google/redirect/${jwtToken}`
			);
		}

		const createdUser = await this.usersService.createUser(
			{
				firstName: firstName,
				lastName: lastName,

				// Email
				email: email,

				// Address
				city: null,
				country: null,
				postCode: null,

				password: this.randomTokenService.generateRandomToken(8),
				phoneNumber: "01224078792",
				verified: true,
			},
			{
				url: picture,
			}
		);
		this.logger.info(`User with email ${email} created successfully`);

		const payload = {
			userId: createdUser.id,
		};

		const jwtToken = await this.jwtService.sign(payload);
		const refreshToken = await this.jwtService.sign(payload, {
			expiresIn: "7d",
		});
		this.logger.info(
			`JWT and refresh tokens generated for user ID: ${createdUser.id}`
		);

		await this.notificationsService.createNotification(createdUser.id, {
			message: "Welcome in Tech Vault.",
		});
		this.logger.info(
			`Welcome notification created for user ID: ${createdUser.id}`
		);

		const welcomeMessageMailOptions = {
			from: this.configService.get<string>("MAIL_USERNAME"),
			to: createdUser.emails.find((email) => email.isPrimary).email,
			subject: "Welcome Message",
			template: "./welcome-message",
			context: {
				homePageUrl: this.configService.get<string>("FRONT_END_ENDPOINT"),
				userName: `${createdUser.firstName} ${createdUser.lastName}`,
			},
		};

		await this.mailService.sendMail(welcomeMessageMailOptions);
		this.logger.info(
			`Welcome email sent to ${createdUser.emails.find((email) => email.isPrimary).email}`
		);

		return res.redirect(
			`${this.configService.get<string>("FRONT_END_ENDPOINT")}/google/redirect/?jwtToken=${jwtToken}&jwtRefreshToken=${refreshToken}`
		);
	}

	public async requestPasswordReset(email: string) {
		this.logger.info(`requestPasswordReset called with email: ${email}`);

		const isUserExists = await this.usersService.isUserExists(email);

		if (!isUserExists) {
			this.logger.warn(`User with email ${email} does not exist`);
			throw new NotFoundException("User does not exists.");
		}

		const targetUser = await this.usersService.findUserByEmail(email);

		const payload = {
			userId: targetUser.id,
		};

		const resetToken = await this.jwtService.sign(payload, {
			expiresIn: "1h",
		});
		this.logger.info(`Reset token generated for user ID: ${targetUser.id}`);

		await this.usersService.updateUser(targetUser.id, {
			resetToken,
		});

		const mailOptions = {
			from: this.configService.get<string>("MAIL_USERNAME"),
			to: email,
			subject: "Reset Password",
			template: "./reset-password",
			context: {
				firstName: targetUser.firstName,
				lastName: targetUser.lastName,
				resetLink: `${this.configService.get<string>("FRONT_END")}/reset-password/${resetToken}`,
				email: email,
			},
		};

		await this.mailService.sendMail(mailOptions);
		this.logger.info(`Password reset email sent to ${email}`);

		return {
			message: "Please check your Email.",
		};
	}

	public async validateResetToken(resetToken: string) {
		this.logger.info(`validateResetToken called with token: ${resetToken}`);

		let payload;
		const targetUser = await this.usersService.findUserByResetToken(resetToken);

		if (!targetUser) {
			this.logger.warn(`Invalid reset token: ${resetToken}`);
			throw new BadRequestException("Token is Invalid.");
		}

		try {
			payload = await this.jwtService.verify(targetUser.resetToken);
		} catch (error) {
			this.logger.warn(`Token expired for reset token: ${resetToken}`);
			if (error.name === "TokenExpiredError") {
				throw new BadRequestException("Token has expired.");
			} else {
				throw new BadRequestException("Token is invalid.");
			}
		}

		await this.usersService.updateUser(targetUser.id, {
			resetToken: null,
			resetTokenExpirationDate: null,
		});

		return {
			userId: payload.userId,
		};
	}

	public async resetPassword({ resetToken, password }) {
		this.logger.info(`resetPassword called with reset token: ${resetToken}`);

		const { userId } = await this.validateResetToken(resetToken);

		this.logger.info(`Reset token validated for user ID: ${userId}`);

		const updatedUser = await this.usersService.updateUser(userId, {
			password: password,
		});
		this.logger.info(`Password updated successfully for user ID: ${userId}`);

		await this.notificationsService.createNotification(updatedUser.id, {
			message: "Welcome in Tech Vault.",
		});
		this.logger.info(
			`Welcome notification created for user ID: ${updatedUser.id}`
		);

		const welcomeMessageMailOptions = {
			from: this.configService.get<string>("MAIL_USERNAME"),
			to: updatedUser.emails.find((email) => email.isPrimary).email,
			subject: "Password Reset Successfully",
			template: "./password-reset-successfully",
			context: {
				loginPageUrl: `${this.configService.get<string>("FRONT_END_ENDPOINT")}/sign_in`,
			},
		};

		await this.mailService.sendMail(welcomeMessageMailOptions);
		this.logger.info(
			`Password reset success email sent to ${updatedUser.emails.find((email) => email.isPrimary).email}`
		);

		return updatedUser;
	}
}
