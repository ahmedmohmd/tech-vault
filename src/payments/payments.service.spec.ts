import { Test, TestingModule } from "@nestjs/testing";
import { Repository } from "typeorm";
import { Order } from "../orders/order.entity";
import { UsersService } from "../users/users.service";
import { PaymentsService } from "./payments.service";

describe("PaymentsService", () => {
	let service: PaymentsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: PaymentsService,
					useValue: {},
				},
				{
					provide: UsersService,
					useValue: {},
				},
				{
					provide: Repository<Order>,
					useValue: {},
				},
			],
		}).compile();

		service = module.get<PaymentsService>(PaymentsService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
