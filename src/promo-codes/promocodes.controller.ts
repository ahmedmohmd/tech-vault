import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { PromoCodesService } from './promocodes.service';

@Controller('promocodes')
export class PromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  @Get()
  public async getAllPromoCodes() {
    return await this.promoCodesService.findAllPromoCodes();
  }

  @Get(':promoCodeId')
  public async getSinglePromoCode(
    @Param('promoCodeId', ParseIntPipe) promoCodeId: number,
  ) {
    return await this.promoCodesService.findPromoCodeById(promoCodeId);
  }

  @Post()
  public async createPromoCode(@Body() body: CreatePromoCodeDto) {
    return await this.promoCodesService.createPromoCode(body);
  }

  @Patch(':promoCodeId')
  public async updatePromoCode(
    @Param('promoCodeId', ParseIntPipe) promoCodeId: number,
    @Body() body: CreatePromoCodeDto,
  ) {
    return await this.promoCodesService.updatePromoCode(promoCodeId, body);
  }

  @Delete(':promoCodeId')
  public async deletePromoCode(
    @Param('promoCodeId', ParseIntPipe) promoCodeId: number,
  ) {
    return await this.deletePromoCode(promoCodeId);
  }
}
