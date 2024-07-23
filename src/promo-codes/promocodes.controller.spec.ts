import { Test, TestingModule } from "@nestjs/testing";
import { PromoCodesController } from "./promocodes.controller";
import { PromoCodesService } from "./promocodes.service";

describe("PromoCodesController", () => {
  let controller: PromoCodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromoCodesController],
      providers: [
        {
          provide: PromoCodesService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PromoCodesController>(PromoCodesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
