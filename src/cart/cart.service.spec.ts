import { Test, TestingModule } from "@nestjs/testing";
import { Repository } from "typeorm";
import { OrdersService } from "../orders/orders.service";
import { PaymentsService } from "../payments/payments.service";
import { ProductsService } from "../products/products.service";
import { PromoCodesService } from "../promo-codes/promocodes.service";
import { UsersService } from "../users/users.service";
import { CartItem } from "./cart-item.entity";
import { Cart } from "./cart.entity";
import { CartService } from "./cart.service";

describe("CartService", () => {
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CartService,
          useValue: {},
        },
        {
          provide: Repository<Cart>,
          useValue: {},
        },
        {
          provide: Repository<CartItem>,
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
        {
          provide: OrdersService,
          useValue: {},
        },
        {
          provide: PaymentsService,
          useValue: {},
        },
        {
          provide: PromoCodesService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
