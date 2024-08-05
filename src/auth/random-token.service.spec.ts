import { Test, TestingModule } from "@nestjs/testing";
import { RandomTokenService } from "./random-token.service";

describe("RandomTokenService", () => {
	let service: RandomTokenService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [RandomTokenService],
		}).compile();

		service = module.get<RandomTokenService>(RandomTokenService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
