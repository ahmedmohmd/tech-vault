import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../users/users.service";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";

describe("ReviewsController", () => {
	let controller: ReviewsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ReviewsController],
			providers: [
				{
					provide: ReviewsService,
					useValue: {},
				},
				{
					provide: UsersService,
					useValue: {},
				},
			],
		}).compile();

		controller = module.get<ReviewsController>(ReviewsController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
