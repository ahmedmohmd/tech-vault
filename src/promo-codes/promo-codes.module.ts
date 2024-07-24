import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { PromoCode } from "./promo-code.entity";
import { PromoCodesController } from "./promo-codes.controller";
import { PromoCodesService } from "./promo-codes.service";

@Module({
  controllers: [PromoCodesController],
  providers: [PromoCodesService],
  imports: [TypeOrmModule.forFeature([PromoCode]), UsersModule],
  exports: [PromoCodesService],
})
export class PromoCodesModule {}
