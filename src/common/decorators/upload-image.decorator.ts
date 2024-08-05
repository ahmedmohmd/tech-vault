import { BadRequestException } from "@nestjs/common";
import { UseInterceptors } from "@nestjs/common/decorators/core/use-interceptors.decorator";
import { FileInterceptor } from "@nestjs/platform-express";

export const UploadImage = (imageName: string) =>
	UseInterceptors(
		FileInterceptor(imageName, {
			fileFilter: (req, file, callback) => {
				if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
					return callback(
						new BadRequestException("JPG, JPEG, PNG image only allowed."),
						false
					);
				}
				callback(null, true);
			},
			limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
		})
	);
