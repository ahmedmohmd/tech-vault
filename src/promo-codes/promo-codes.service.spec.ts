import { Test, TestingModule } from "@nestjs/testing";
import { Repository } from "typeorm";
import { PromoCode } from "./promo-code.entity";
import { PromoCodesService } from "./promo-codes.service";

describe("PromoCodesService", () => {
  let service: PromoCodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PromoCodesService,
          useValue: {},
        },
        {
          provide: Repository<PromoCode>,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PromoCodesService>(PromoCodesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
