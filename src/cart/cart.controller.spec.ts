import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../users/users.service";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";

describe("CartController", () => {
	let controller: CartController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CartController],
			providers: [
				{
					provide: CartService,
					useValue: {},
				},
				{
					provide: UsersService,
					useValue: {},
				},
			],
		}).compile();

		controller = module.get<CartController>(CartController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
