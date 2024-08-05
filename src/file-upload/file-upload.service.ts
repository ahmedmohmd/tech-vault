import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

interface IUploadImage {
	file: Express.Multer.File;
	path: string;
}

@Injectable()
export class FileUploadService {
	constructor(private readonly cloudinaryService: CloudinaryService) {}

	public async uploadImage({ file, path }: IUploadImage) {
		try {
			if (!file || !path) {
				return;
			}
			return await this.cloudinaryService.uploadImage(file, path);
		} catch (error) {
			console.error(`Internal Server Error: ${error}`);
			throw new InternalServerErrorException("Internal server error.");
		}
	}

	public async removeImage(imageId: string) {
		try {
			return await this.cloudinaryService.removeImage(imageId);
		} catch (error) {
			console.error(`Internal Server Error: ${error}`);
			throw new InternalServerErrorException("Internal server error.");
		}
	}
}
