import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../users/users.service";
import { PromoCodesController } from "./promo-codes.controller";
import { PromoCodesService } from "./promo-codes.service";

describe("PromoCodesController", () => {
	let controller: PromoCodesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PromoCodesController],
			providers: [
				{
					provide: PromoCodesService,
					useValue: {},
				},
				{
					provide: UsersService,
					useValue: {},
				},
			],
		}).compile();

		controller = module.get<PromoCodesController>(PromoCodesController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
