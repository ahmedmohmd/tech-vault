import { Test, TestingModule } from "@nestjs/testing";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { UsersService } from "../users/users.service";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";

describe("CategoriesController", () => {
	let controller: CategoriesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CategoriesController],
			providers: [
				{
					provide: CategoriesService,
					useValue: {},
				},
				{
					provide: UsersService,
					useValue: {},
				},
				{
					provide: WINSTON_MODULE_PROVIDER,
					useValue: {},
				},
			],
		}).compile();

		controller = module.get<CategoriesController>(CategoriesController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
