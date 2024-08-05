import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../users/users.service";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";

describe("PaymentsController", () => {
	let controller: PaymentsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PaymentsController],
			providers: [
				{
					provide: PaymentsService,
					useValue: {},
				},
				{
					provide: UsersService,
					useValue: {},
				},
			],
		}).compile();

		controller = module.get<PaymentsController>(PaymentsController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
