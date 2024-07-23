import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import * as multer from "multer";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { FileUploadController } from "./file-upload.controller";
import { FileUploadService } from "./file-upload.service";

@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService],
  imports: [
    CloudinaryModule,
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],

  exports: [FileUploadService],
})
export class FileUploadModule {}
