import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { BcryptService } from "../bcrypt/bcrypt.service";
import { FileUploadService } from "../file-upload/file-upload.service";
import { MailService } from "../mail/mail.service";
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
  ) {}

  public async signUpWithCredentials(
    userData: SignUpDto,
    userImage: Express.Multer.File,
  ) {
    const customUserData = Object.assign(userData, {
      password: await this.bcryptService.hashPassword(userData.password),
      verificationToken: this.randomTokenService.generateRandomToken(
        this.configService.get<number>("VERIFICATION_TOKEN_LENGTH"),
      ),
    });

    const isUserExists = await this.usersService.isUserExists(userData.email);

    if (isUserExists) {
      throw new BadRequestException("User already Exists.");
    }

    const uploadedImage = await this.fileUploadService.uploadImage({
      file: userImage,
      path: "e-commerce/images/users-images",
    });

    const createdUser = await this.usersService.createUser(customUserData, {
      url: uploadedImage?.secure_url,
      imagePublicId: uploadedImage?.public_id,
    });

    if (createdUser) {
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
    }

    const payload = {
      userId: createdUser.id,
    };

    const jwtToken = await this.jwtService.sign(payload);
    const refreshToken = await this.jwtService.sign(payload, {
      expiresIn: "7d",
    });

    return {
      jwtToken,
      jwtRefreshToken: refreshToken,
    };
  }

  public async signIn({ email, password }: SignInDto) {
    const targetUser = await this.usersService.findUserByEmail(email);

    if (!targetUser) throw new NotFoundException("User doesn't exists.");

    const isCorrectPassword = await this.bcryptService.comparePassword(
      password,
      targetUser.password,
    );

    if (!isCorrectPassword)
      throw new BadRequestException("Password is incorrect.");

    const payload = {
      userId: targetUser.id,
    };

    const jwtToken = await this.jwtService.sign(payload);
    const refreshToken = await this.jwtService.sign(payload, {
      expiresIn: "7d",
    });

    return {
      jwtToken,
      jwtRefreshToken: refreshToken,
    };
  }

  public async verifyEmail(verificationToken: string) {
    const targetUser =
      await this.usersService.findUserByVerificationToken(verificationToken);

    if (!targetUser) {
      throw new NotFoundException("User not Found.");
    }

    await this.usersService.updateUser(targetUser.id, {
      verificationToken: null,
      verified: true,
    });

    return;
  }

  public async authWithGoogle(
    { email, firstName, lastName, picture }: IGoogleUser,
    res: Response,
  ) {
    const isUserExists = await this.usersService.isUserExists(email);

    if (isUserExists) {
      const targetUser = await this.usersService.findUserByEmail(email);

      const payload = {
        userId: targetUser.id,
      };

      const jwtToken = await this.jwtService.sign(payload);

      return res.redirect(`http://localhost:5173/google/redirect/${jwtToken}`);
    }

    const createdUser = await this.usersService.createUser(
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        address: "Qina",
        password: this.randomTokenService.generateRandomToken(8),
        phoneNumber: "01224078792",
        verified: true,
      },
      {
        url: picture,
      },
    );

    const payload = {
      userId: createdUser.id,
    };

    const jwtToken = await this.jwtService.sign(payload);
    const refreshToken = await this.jwtService.sign(payload, {
      expiresIn: "7d",
    });

    return res.redirect(
      `${this.configService.get<string>("FRONT_END_ENDPOINT")}/google/redirect/?jwtToken=${jwtToken}&jwtRefreshToken=${refreshToken}`,
    );
  }

  public async requestPasswordReset(email: string) {
    const isUserExists = await this.usersService.isUserExists(email);

    if (!isUserExists) {
      throw new NotFoundException("User does not exists.");
    }

    const targetUser = await this.usersService.findUserByEmail(email);

    const payload = {
      userId: targetUser.id,
    };

    const resetToken = await this.jwtService.sign(payload, {
      expiresIn: "1h",
    });

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

    return {
      message: "Please check your Email.",
    };
  }

  public async validateResetToken(resetToken: string) {
    let payload;
    const targetUser = await this.usersService.findUserByResetToken(resetToken);

    if (!targetUser) {
      throw new BadRequestException("Token is Invalid.");
    }

    try {
      payload = await this.jwtService.verify(targetUser.resetToken);
    } catch (error) {
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
    try {
      const { userId } = await this.validateResetToken(resetToken);

      await this.usersService.updateUser(userId, {
        password: password,
      });

      return {
        message: "User's password has updated successfully.",
      };
    } catch (error) {
      console.error(`Internal Server Error: ${error}`);
      throw new InternalServerErrorException("Internal server error.");
    }
  }

  public async addEmailToUser(userId: number, email: string) {
    const targetUser = await this.usersService.findUser(userId);

    if (!targetUser) {
      throw new NotFoundException("User not Found.");
    }

    const targetEmail = await this.usersService.findEmail(email);

    if (targetEmail) {
      throw new BadRequestException("Email is already Exists.");
    }

    return await this.usersService.addEmail(userId, email);
  }

  public async deleteEmail(userId: number, email: string) {
    const targetUser = await this.usersService.findUser(userId);

    if (!targetUser) {
      throw new NotFoundException("User not Found.");
    }
    const targetEmail = await this.usersService.findEmail(email);

    if (!targetEmail) {
      throw new NotFoundException("Email is not Exists.");
    }

    return await this.usersService.deleteEmail(userId, email);
  }
}
