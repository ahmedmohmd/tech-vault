import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../users/users.service";
import { WishlistController } from "./wishlist.controller";
import { WishlistService } from "./wishlist.service";

describe("WishlistController", () => {
	let controller: WishlistController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [WishlistController],
			providers: [
				{
					provide: WishlistService,
					useValue: {},
				},
				{
					provide: UsersService,
					useValue: {},
				},
			],
		}).compile();

		controller = module.get<WishlistController>(WishlistController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
