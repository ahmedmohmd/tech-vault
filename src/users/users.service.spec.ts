import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { Repository } from "typeorm";
import { FileUploadService } from "../file-upload/file-upload.service";
import { MailService } from "../mail/mail.service";
import { UserImage } from "./user-image.entity";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

describe("UsersService", () => {
	let service: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: UsersService,
					useValue: {},
				},
				{
					provide: FileUploadService,
					useValue: {},
				},
				{
					provide: ConfigService,
					useValue: {},
				},
				{
					provide: MailService,
					useValue: {},
				},
				{
					provide: Repository<User>,
					useValue: {},
				},
				{
					provide: Repository<UserImage>,
					useValue: {},
				},
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
