import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { RandomTokenService } from './random-token.service';

// Types & Interfaces
interface ICreateUser {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

interface ISignIn {
  email: string;
  password: string;
}

interface IGoogleUser {
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
}

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
    userData: ICreateUser,
    userImage: Express.Multer.File,
  ) {
    const customUserData = Object.assign(userData, {
      password: await this.bcryptService.hashPassword(userData.password),
      verificationToken: this.randomTokenService.generateRandomToken(
        this.configService.get<number>('VERIFICATION_TOKEN_LENGTH'),
      ),
    });

    const isUserExists = await this.usersService.isUserExists(userData.email);

    if (isUserExists) {
      throw new BadRequestException('User already Exists.');
    }

    const { public_id, secure_url } = await this.fileUploadService.uploadImage({
      file: userImage,
      path: 'e-commerce/images/users-images',
    });

    const createdUser = await this.usersService.createUser(customUserData, {
      url: secure_url,
      imagePublicId: public_id,
    });

    if (createdUser) {
      const mailOptions = {
        from: this.configService.get<string>('MAIL_USERNAME'),
        to: createdUser.email,
        subject: 'Verify Email',
        template: './email-verification',
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

    return {
      jwtToken,
    };
  }

  public async signIn({ email, password }: ISignIn) {
    const targetUser = await this.usersService.findUserByEmail(email);

    if (!targetUser) throw new NotFoundException("User doesn't exists.");

    const isCorrectPassword = await this.bcryptService.comparePassword(
      password,
      targetUser.password,
    );

    if (!isCorrectPassword)
      throw new BadRequestException('Password is incorrect.');

    const payload = {
      userId: targetUser.id,
    };

    const jwtToken = await this.jwtService.sign(payload);

    return {
      jwtToken,
    };
  }

  public async verifyEmail(verificationToken: string) {
    const targetUser =
      await this.usersService.findUserByVerificationToken(verificationToken);

    if (targetUser) {
      await this.usersService.updateUser(targetUser.id, {
        verificationToken: null,
        verified: true,
      });

      return {
        message: 'Your are Verified Successfully.',
      };
    }

    return {
      message: 'Sorry, Your Email is not Verified .',
    };
  }

  public async authWithGoogle(
    { email, firstName, lastName, picture }: IGoogleUser,
    res: Response,
  ) {
    const isUserExists = await this.usersService.isUserExists(email);

    if (isUserExists) {
      let targetUser = await this.usersService.findUserByEmail(email);

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
        password: this.randomTokenService.generateRandomToken(8),
        verificationToken: null,
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

    return res.redirect(`http://localhost:5173/google/redirect/${jwtToken}`);
  }

  public async requestPasswordReset(email: string) {
    const isUserExists = await this.usersService.isUserExists(email);

    if (!isUserExists) {
      throw new BadRequestException('User does not exists.');
    }

    const targetUser = await this.usersService.findUserByEmail(email);

    const payload = {
      userId: targetUser.id,
    };

    const resetToken = await this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    await this.usersService.updateUser(targetUser.id, {
      resetToken,
    });

    const mailOptions = {
      from: this.configService.get<string>('MAIL_USERNAME'),
      to: targetUser.email,
      subject: 'Reset Password',
      template: './reset-password',
      context: {
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        resetLink: `${this.configService.get<string>('FRONT_END')}/reset-password/${resetToken}`,
        email: targetUser.email,
      },
    };

    await this.mailService.sendMail(mailOptions);

    return {
      message: 'Please check your Email.',
    };
  }

  public async validateResetToken(resetToken: string) {
    let payload;
    const targetUser = await this.usersService.findUserByResetToken(resetToken);

    if (!targetUser) {
      throw new BadRequestException('Token is Invalid.');
    }

    try {
      payload = await this.jwtService.verify(targetUser.resetToken);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Token has expired.');
      } else {
        throw new BadRequestException('Token is invalid.');
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
      throw new InternalServerErrorException('Internal server error.');
    }
  }
}
