import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CreatePromoCodeDto } from "./dto/create-promo-code.dto";
import { GetAllPromoCodesQueryParamsDto } from "./dto/get-all-promocodes-query-params.dto";
import { PromoCodesService } from "./promocodes.service";

@Controller("promo_codes")
export class PromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  @Get()
  public async getAllPromoCodes(
    @Query() query: GetAllPromoCodesQueryParamsDto,
  ) {
    return await this.promoCodesService.findAllPromoCodes(query);
  }

  @Get(":promoCodeId")
  public async getSinglePromoCode(
    @Param("promoCodeId", ParseIntPipe) promoCodeId: number,
  ) {
    return await this.promoCodesService.findPromoCodeById(promoCodeId);
  }

  @Post()
  public async createPromoCode(@Body() body: CreatePromoCodeDto) {
    return await this.promoCodesService.createPromoCode(body);
  }

  @Patch(":promoCodeId")
  public async updatePromoCode(
    @Param("promoCodeId", ParseIntPipe) promoCodeId: number,
    @Body() body: CreatePromoCodeDto,
  ) {
    return await this.promoCodesService.updatePromoCode(promoCodeId, body);
  }

  @Delete("remove_expired")
  public async clearAllNonActivePromoCodes() {
    return await this.promoCodesService.clearAllNonActivePromoCodes();
  }

  @Delete(":promoCodeId")
  public async deletePromoCode(
    @Param("promoCodeId", ParseIntPipe) promoCodeId: number,
  ) {
    return await this.promoCodesService.deletePromoCode(promoCodeId);
  }
}
