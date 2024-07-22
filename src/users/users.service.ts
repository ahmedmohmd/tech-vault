import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { SignUpDto } from "src/auth/dto/sign-up.dto";
import { MailService } from "src/mail/mail.service";
import { Repository } from "typeorm";
import { FileUploadService } from "../file-upload/file-upload.service";
import { Address } from "./address.entity";
import { GetAllUsersQueryDto } from "./dto/get-all-users-query.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Email } from "./email.entity";
import { ISortAttributes } from "./enums/query-params.enum";
import { Phone } from "./phone.entity";
import { UserImage } from "./user-image.entity";
import { User } from "./user.entity";

interface ICreateUserImage {
  url: string;
  imagePublicId?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(UserImage)
    private readonly userImageRepository: Repository<UserImage>,
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
    @InjectRepository(Phone)
    private readonly phoneRepository: Repository<Phone>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
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
      .leftJoinAndSelect("user.userImage", "userImage")
      .leftJoinAndSelect("user.emails", "emails")
      .leftJoinAndSelect("user.phoneNumbers", "phoneNumbers");

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

      relations: ["userImage", "emails"],
    });

    if (!targetUser) {
      throw new NotFoundException("User not Found.");
    }

    return targetUser;
  }

  public async createUser(
    userData: SignUpDto & { verified?: boolean },
    imageDate: ICreateUserImage,
  ): Promise<User> {
    try {
      const createdUser = this.usersRepository.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: userData.password,
        emails: [],
        phoneNumbers: [],
        addresses: [],
      });
      let createdImage;
      if (imageDate.imagePublicId) {
        createdImage = this.userImageRepository.create(imageDate);
      }

      const createdEmail = this.emailRepository.create({
        email: userData.email,
      });
      createdEmail.isPrimary = true;

      const createdPhoneNumber = this.phoneRepository.create({
        phoneNumber: userData.phoneNumber,
      });
      createdPhoneNumber.isPrimary = true;

      const createdAddress = this.addressRepository.create({
        city: userData.city,
        country: userData.country,
        postCode: userData.postCode,
      });
      createdAddress.isPrimary = true;

      createdUser.userImage = createdImage;
      createdUser.emails.push(createdEmail);
      createdUser.phoneNumbers.push(createdPhoneNumber);
      createdUser.addresses.push(createdAddress);

      return await this.usersRepository.save(createdUser);
    } catch (error) {
      console.error(`Internal Server Error: ${error}`);
      throw new InternalServerErrorException("Internal server error.");
    }
  }

  public async isUserExists(email: string): Promise<boolean> {
    try {
      return await this.emailRepository.exists({
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
    userData: Partial<UpdateUserDto>,
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

    // if (userData?.email?.email) {
    //   updatedUser.verified = false;

    //   const mailOptions = {
    //     from: this.configService.get<string>("MAIL_USERNAME"),
    //     to: updatedUser.email.email,
    //     subject: "Verify Email",
    //     template: "./email-verification",
    //     context: {
    //       firstName: updatedUser.firstName,
    //       lastName: updatedUser.lastName,
    //       verificationToken: updatedUser.verificationToken,
    //     },
    //   };

    //   await this.mailService.sendMail(mailOptions);
    // }

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
    return await this.usersRepository
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.emails", "email")
      .where("email.email = :email", { email })
      .getOne();
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

  public async isEmailExists(email: string) {
    return await this.emailRepository.exists({
      where: {
        email: email,
      },
    });
  }

  public async createEmail(email: string) {
    const isEmailExists = this.isEmailExists(email);

    if (isEmailExists) {
      throw new BadRequestException("Emails is already exists.");
    }

    const createdEmail = this.emailRepository.create({
      email: email,
    });

    return await this.emailRepository.save(createdEmail);
  }

  public async addEmail(userId: number, email: string) {
    const targetUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: ["emails"],
    });

    if (!targetUser) {
      throw new NotFoundException("User not Found.");
    }

    const targetEmail = await this.emailRepository.findOne({
      where: {
        email: email,
      },
    });

    if (targetEmail) {
      throw new BadRequestException("Email is already Exists.");
    }

    const createdEmail = this.emailRepository.create({
      email: email,
    });

    if (
      targetUser.emails.length <= 0 ||
      !targetUser.emails.find((email) => email.isPrimary === true)
    ) {
      createdEmail.isPrimary = true;
    }

    const savedEmail = await this.emailRepository.save(createdEmail);

    targetUser.emails.push(createdEmail);

    await this.usersRepository.save(targetUser);

    return savedEmail;
  }

  public async deleteEmail(userId: number, email: string) {
    const targetUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: ["emails"],
    });

    if (!targetUser) {
      throw new NotFoundException("User not Found.");
    }

    const targetEmail = await this.emailRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!targetEmail) {
      throw new NotFoundException("Email is not Exists.");
    }

    if (targetEmail.isPrimary) {
      throw new BadRequestException("Email is si Primary.");
    }

    targetUser.emails = targetUser.emails.filter(
      (email) => email.id !== targetEmail.id,
    );

    await this.emailRepository.remove(targetEmail);
    await this.usersRepository.save(targetUser);

    return null;
  }

  public async findEmail(email: string) {
    return await this.emailRepository.findOne({
      where: {
        email,
      },
    });
  }

  public async makeEmailPrimary(userId: number, email: string) {
    const targetUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: ["emails"],
    });

    if (!targetUser) {
      throw new NotFoundException("User not Found.");
    }

    const targetEmail = await this.emailRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!targetEmail) {
      throw new NotFoundException("Email is not Exists.");
    }

    if (targetEmail.isPrimary) {
      return;
    }

    const currentPrimaryEmailId = targetUser.emails.find(
      (email) => email.isPrimary,
    ).id;

    let currentPrimaryEmail;
    if (currentPrimaryEmailId)
      currentPrimaryEmail = await this.emailRepository.findOne({
        where: {
          id: currentPrimaryEmailId,
        },
      });

    targetEmail.isPrimary = true;
    if (currentPrimaryEmailId) currentPrimaryEmail.isPrimary = false;

    if (currentPrimaryEmailId)
      await this.emailRepository.save(currentPrimaryEmail);
    return await this.emailRepository.save(targetEmail);
  }

  public async addPhoneNumber(userId: number, phoneNumber: string) {
    const targetUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: ["phoneNumbers"],
    });

    if (!targetUser) {
      throw new NotFoundException("User not Found.");
    }

    const targetPhoneNumber = await this.phoneRepository.findOne({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (targetPhoneNumber) {
      throw new BadRequestException("Phone Number is already Exists.");
    }

    const createdPhoneNumber = this.phoneRepository.create({
      phoneNumber: phoneNumber,
    });

    const savedPhoneNumber =
      await this.phoneRepository.save(createdPhoneNumber);

    if (
      targetUser.phoneNumbers.length <= 0 ||
      !targetUser.phoneNumbers.find((phone) => phone.isPrimary === true)
    ) {
      createdPhoneNumber.isPrimary = true;
    }

    targetUser.phoneNumbers.push(savedPhoneNumber);

    await this.usersRepository.save(targetUser);

    return savedPhoneNumber;
  }

  public async deletePhoneNumber(userId: number, phoneNumber: string) {
    const targetUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: ["phoneNumbers"],
    });

    if (!targetUser) {
      throw new NotFoundException("User not Found.");
    }

    const targetPhoneNumber = await this.phoneRepository.findOne({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (!targetPhoneNumber) {
      throw new NotFoundException("Phone Number is not Exists.");
    }

    if (targetPhoneNumber.isPrimary) {
      throw new BadRequestException("PhoneNumber is Primary.");
    }

    targetUser.phoneNumbers = targetUser.phoneNumbers.filter(
      (phoneNumber) => phoneNumber.id !== phoneNumber.id,
    );

    await this.phoneRepository.remove(targetPhoneNumber);
    await this.usersRepository.save(targetUser);

    return null;
  }

  public async makePhoneNumberPrimary(userId: number, phoneNumber: string) {
    const targetUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: ["phoneNumbers"],
    });

    if (!targetUser) {
      throw new NotFoundException("User not Found.");
    }

    const targetPhoneNumber = await this.phoneRepository.findOne({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (!targetPhoneNumber) {
      throw new NotFoundException("Phone Number is not Exists.");
    }

    if (targetPhoneNumber.isPrimary) {
      return;
    }

    const currentPhoneNumberId = targetUser.phoneNumbers.find(
      (phoneNumber) => phoneNumber.isPrimary,
    )?.id;

    let currentPhoneNumber;
    if (currentPhoneNumberId)
      currentPhoneNumber = await this.phoneRepository.findOne({
        where: {
          id: currentPhoneNumberId,
        },
      });

    targetPhoneNumber.isPrimary = true;
    if (currentPhoneNumberId) currentPhoneNumber.isPrimary = false;

    if (currentPhoneNumberId)
      await this.phoneRepository.save(currentPhoneNumber);
    return await this.phoneRepository.save(targetPhoneNumber);
  }
}
