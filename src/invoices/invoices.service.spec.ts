import { Test, TestingModule } from "@nestjs/testing";
import { OrdersService } from "../orders/orders.service";
import { InvoicesService } from "./invoices.service";

describe("InvoicesService", () => {
	let service: InvoicesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: InvoicesService,
					useValue: {},
				},
				{
					provide: OrdersService,
					useValue: {},
				},
			],
		}).compile();

		service = module.get<InvoicesService>(InvoicesService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
