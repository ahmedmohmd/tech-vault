import { Test, TestingModule } from "@nestjs/testing";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { NotificationsService } from "./notifications.service";

describe("NotificationsService", () => {
	let service: NotificationsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: NotificationsService,
					useValue: {},
				},
				{
					provide: Repository<Notification>,
					useValue: {},
				},
				{
					provide: UsersService,
					useValue: {},
				},
			],
		}).compile();

		service = module.get<NotificationsService>(NotificationsService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
