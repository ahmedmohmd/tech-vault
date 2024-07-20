import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { MailService } from "src/mail/mail.service";
import { Repository } from "typeorm";
import { FileUploadService } from "../file-upload/file-upload.service";
import { GetAllUsersQueryDto } from "./dto/get-all-users-query.dto";
import { ISortAttributes } from "./enums/query-params.enum";
import { UserImage } from "./user-image.entity";
import { User } from "./user.entity";

interface ICreateUserImage {
  url: string;
  imagePublicId?: string;
}

// interface IUpdateUserImage extends Partial<ICreateUserImage> {}

interface ICreateUser {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  verificationToken?: string;
  verified?: boolean;
  resetToken?: string;
  resetTokenExpirationDate?: Date;
}

interface IUpdateUser extends Partial<ICreateUser> {
  verified?: boolean;
  verificationToken?: string;
  resetToken?: string;
  resetTokenExpirationDate?: Date;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(UserImage)
    private readonly userImageRepository: Repository<UserImage>,
    private readonly fileUploadService: FileUploadService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}
  public async getAllUsers({
    page,
    limit,
    order,
    verified: isVerified,
    sortBy,
  }: GetAllUsersQueryDto) {
    const allUsers = await this.usersRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.userImage", "userImage");

    if (isVerified) {
      allUsers.where(`user.verified = :verified`, {
        verified: isVerified === "true" ? true : false,
      });
    }

    if (page) {
      allUsers.skip((+page - 1) * +limit);
    }

    if (limit) {
      allUsers.limit(+limit);
    }

    if (sortBy) {
      switch (sortBy) {
        case ISortAttributes.createdAt:
          allUsers.addOrderBy("user.createdAt", order);
          break;

        case ISortAttributes.name:
          allUsers.addOrderBy("user.firstName", order);
          break;
      }
    }

    return allUsers.getMany();
  }

  public async getSingleUser(userId: number) {
    const targetUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },

      relations: ["userImage"],
    });

    if (!targetUser) {
      throw new NotFoundException("User not Found.");
    }

    return targetUser;
  }

  public async createUser(
    userData: ICreateUser,
    imageDate: ICreateUserImage,
  ): Promise<User> {
    try {
      const createdUser = await this.usersRepository.create(userData);
      const createdImage = await this.userImageRepository.create(imageDate);

      createdUser.userImage = createdImage;

      return await this.usersRepository.save(createdUser);
    } catch (error) {
      console.error(`Internal Server Error: ${error}`);
      throw new InternalServerErrorException("Internal server error.");
    }
  }

  public async isUserExists(email: string): Promise<boolean> {
    try {
      return await this.usersRepository.exists({
        where: {
          email: email,
        },
      });
    } catch (error) {
      console.error(`Internal Server Error: ${error}`);
      throw new InternalServerErrorException("Internal server error.");
    }
  }

  public async updateUser(
    userId: number,
    userData: IUpdateUser,
    userImage?: Express.Multer.File,
  ) {
    const targetUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: ["userImage"],
    });

    if (!targetUser) {
      throw new NotFoundException("User not found.");
    }

    const targetImage = await this.userImageRepository.findOne({
      where: {
        id: targetUser?.userImage?.id,
      },
    });

    if (targetImage) {
      await this.fileUploadService.removeImage(
        targetUser.userImage?.imagePublicId,
      );
    }

    const uploadedImage = await this.fileUploadService.uploadImage({
      file: userImage,
      path: "e-commerce/users-images",
    });

    if (uploadedImage) {
      targetImage.imagePublicId = uploadedImage?.public_id;
      targetImage.url = uploadedImage?.secure_url;
    }

    await this.userImageRepository.save(targetImage);

    const updatedUser = Object.assign(targetUser, {
      ...userData,
      userImage: targetImage,
    });

    if (userData.email) {
      updatedUser.verified = false;

      const mailOptions = {
        from: this.configService.get<string>("MAIL_USERNAME"),
        to: updatedUser.email,
        subject: "Verify Email",
        template: "./email-verification",
        context: {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          verificationToken: updatedUser.verificationToken,
        },
      };

      await this.mailService.sendMail(mailOptions);
    }

    return await this.usersRepository.save(updatedUser);
  }

  public async findUserByVerificationToken(token: string) {
    try {
      return await this.usersRepository.findOne({
        where: {
          verificationToken: token,
        },
      });
    } catch (error) {
      console.error(`Internal Server Error: ${error}`);
      throw new InternalServerErrorException("Internal server error.");
    }
  }

  public async findUserByEmail(email: string) {
    try {
      return await this.usersRepository.findOne({
        where: {
          email,
        },
      });
    } catch (error) {
      console.error(`Internal Server Error: ${error}`);
      throw new InternalServerErrorException("Internal server error.");
    }
  }

  public async findUserByResetToken(resetToken: string) {
    try {
      return await this.usersRepository.findOne({
        where: {
          resetToken,
        },
      });
    } catch (error) {
      console.error(`Internal Server Error: ${error}`);
      throw new InternalServerErrorException("Internal server error.");
    }
  }

  public async findUser(userId: number) {
    try {
      return await this.usersRepository.findOne({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      console.error(`Internal Server Error: ${error}`);
      throw new InternalServerErrorException("Internal server error.");
    }
  }

  public async deleteUser(userId: number) {
    const targetUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: ["userImage"],
    });

    if (!targetUser) {
      throw new NotFoundException("User not found.");
    }

    try {
      await this.fileUploadService.removeImage(
        targetUser.userImage.imagePublicId,
      );

      await this.usersRepository.remove(targetUser);
    } catch (error) {
      console.error(`Error: ${error}`);
      throw new InternalServerErrorException("Internal Server Error");
    }

    return;
  }
}
