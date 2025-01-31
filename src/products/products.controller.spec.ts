import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../users/users.service";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

describe("ProductsController", () => {
	let controller: ProductsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ProductsController],
			providers: [
				{
					provide: ProductsService,
					useValue: {},
				},
				{
					provide: UsersService,
					useValue: {},
				},
			],
		}).compile();

		controller = module.get<ProductsController>(ProductsController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
