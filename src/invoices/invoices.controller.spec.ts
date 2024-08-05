import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../users/users.service";
import { InvoicesController } from "./invoices.controller";
import { InvoicesService } from "./invoices.service";

describe("InvoicesController", () => {
	let controller: InvoicesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [InvoicesController],
			providers: [
				{
					provide: InvoicesService,
					useValue: {},
				},
				{
					provide: UsersService,
					useValue: {},
				},
			],
		}).compile();

		controller = module.get<InvoicesController>(InvoicesController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
