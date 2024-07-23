import { Test, TestingModule } from "@nestjs/testing";
import { Repository } from "typeorm";
import { CategoriesService } from "./categories.service";
import { Category } from "./category.entity";

describe("CategoriesService", () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CategoriesService,
          useValue: {},
        },
        {
          provide: Repository<Category>,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
