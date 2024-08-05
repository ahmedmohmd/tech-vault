import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../users/users.service";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

describe("OrdersController", () => {
	let controller: OrdersController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [OrdersController],
			providers: [
				{
					provide: OrdersService,
					useValue: {},
				},
				{
					provide: UsersService,
					useValue: {},
				},
			],
		}).compile();

		controller = module.get<OrdersController>(OrdersController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
