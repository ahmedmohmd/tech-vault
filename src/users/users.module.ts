import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileUploadModule } from "src/file-upload/file-upload.module";
import { MailModule } from "src/mail/mail.module";
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
    TypeOrmModule.forFeature([User, UserImage, Email, Phone]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
