import { Test, TestingModule } from "@nestjs/testing";
import { Repository } from "typeorm";
import { ProductsService } from "../products/products.service";
import { UsersService } from "../users/users.service";
import { Wishlist } from "./wishlist.entity";
import { WishlistService } from "./wishlist.service";

describe("WishlistService", () => {
  let service: WishlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: WishlistService,
          useValue: {},
        },
        {
          provide: Repository<Wishlist>,
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

    service = module.get<WishlistService>(WishlistService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
