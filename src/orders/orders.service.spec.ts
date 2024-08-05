import { Test, TestingModule } from "@nestjs/testing";
import { Repository } from "typeorm";
import { ProductsService } from "../products/products.service";
import { UsersService } from "../users/users.service";
import { OrderItem } from "./order-item.entity";
import { Order } from "./order.entity";
import { OrdersService } from "./orders.service";

describe("OrdersService", () => {
	let service: OrdersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{ provide: Repository<Order>, useValue: {} },
				{ provide: Repository<OrderItem>, useValue: {} },
				{
					provide: OrdersService,
					useValue: {},
				},
				{
					provide: UsersService,
					useValue: {},
				},
				{
					provide: ProductsService,
					useValue: {},
				},
			],
		}).compile();

		service = module.get<OrdersService>(OrdersService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
