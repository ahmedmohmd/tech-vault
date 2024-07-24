import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../users/users.service";
import { Repository } from "typeorm";
import { CategoriesService } from "../categories/categories.service";
import { FileUploadService } from "../file-upload/file-upload.service";
import { ProductImage } from "./product-image.entity";
import { Product } from "./product.entity";
import { ProductsService } from "./products.service";

describe("ProductsService", () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductsService,
          useValue: {},
        },
        {
          provide: Repository<Product>,
          useValue: {},
        },
        {
          provide: Repository<ProductImage>,
          useValue: {},
        },
        {
          provide: FileUploadService,
          useValue: {},
        },
        {
          provide: CategoriesService,
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
