import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileUploadModule } from "../file-upload/file-upload.module";
import { MailModule } from "../mail/mail.module";
import { Address } from "./address.entity";
import { Email } from "./email.entity";
import { Phone } from "./phone.entity";
import { UserImage } from "./user-image.entity";
import { User } from "./user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [
    FileUploadModule,
    MailModule,
    TypeOrmModule.forFeature([User, UserImage, Email, Phone, Address]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
