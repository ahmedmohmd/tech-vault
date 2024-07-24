import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PromoCode } from "./promo-code.entity";
import { PromoCodesController } from "./promo-codes.controller";
import { PromoCodesService } from "./promo-codes.service";

@Module({
  controllers: [PromoCodesController],
  providers: [PromoCodesService],
  imports: [TypeOrmModule.forFeature([PromoCode])],
  exports: [PromoCodesService],
})
export class PromoCodesModule {}
