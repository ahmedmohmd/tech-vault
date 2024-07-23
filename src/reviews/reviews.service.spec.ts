import { Test, TestingModule } from "@nestjs/testing";
import { Repository } from "typeorm";
import { ProductsService } from "../products/products.service";
import { UsersService } from "../users/users.service";
import { Review } from "./review.entity";
import { ReviewsService } from "./reviews.service";

describe("ReviewsService", () => {
  let service: ReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ReviewsService,
          useValue: {},
        },
        {
          provide: Repository<Review>,
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

    service = module.get<ReviewsService>(ReviewsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
