import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoCode } from './promo-code.entity';
import { PromoCodesController } from './promocodes.controller';
import { PromoCodesService } from './promocodes.service';

@Module({
  controllers: [PromoCodesController],
  providers: [PromoCodesService],
  imports: [TypeOrmModule.forFeature([PromoCode])],
  exports: [PromoCodesService],
})
export class PromoCodesModule {}
