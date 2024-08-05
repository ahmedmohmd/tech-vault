import { BadRequestException } from "@nestjs/common";
import { UseInterceptors } from "@nestjs/common/decorators/core/use-interceptors.decorator";
import { FilesInterceptor } from "@nestjs/platform-express";

export const UploadImages = (imageName: string, maxCount: number = 4) =>
	UseInterceptors(
		FilesInterceptor(imageName, maxCount, {
			fileFilter: (req, file, callback) => {
				if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
					return callback(
						new BadRequestException("JPG, JPEG, PNG images only allowed."),
						false
					);
				}
				callback(null, true);
			},
			limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit per file
		})
	);
