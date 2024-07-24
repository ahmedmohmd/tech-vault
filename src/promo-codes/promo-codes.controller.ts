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
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../users/decorators/roles.decorator";
import { Role } from "../users/enums/user-role.enum";
import { RolesGuard } from "../users/guards/roles.guard";
import { CreatePromoCodeDto } from "./dto/create-promo-code.dto";
import { GetAllPromoCodesQueryParamsDto } from "./dto/get-all-promo-codes-query-params.dto";
import { UpdatePromoCodeDto } from "./dto/update-promo-code.dto";
import { PromoCodesService } from "./promo-codes.service";

@ApiBearerAuth()
@ApiTags("Promo Codes")
@Controller("promo_codes")
@UseGuards(JwtAuthGuard, RolesGuard)
export class PromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get all promo codes" })
  @ApiOkResponse({
    status: 200,
    description: "Successfully retrieved promo codes.",
  })
  @ApiForbiddenResponse({ status: 403, description: "Forbidden." })
  @ApiUnauthorizedResponse({ status: 401, description: "Unauthorized." })
  public async getAllPromoCodes(
    @Query() query: GetAllPromoCodesQueryParamsDto,
  ) {
    return await this.promoCodesService.findAllPromoCodes(query);
  }

  @Get(":promo_code_id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get a single promo code by ID" })
  @ApiParam({ name: "promo_code_id", type: Number })
  @ApiNotFoundResponse({ status: 404, description: "Promo Code not Found." })
  @ApiForbiddenResponse({ status: 403, description: "Forbidden." })
  @ApiUnauthorizedResponse({ status: 401, description: "Unauthorized." })
  @ApiOkResponse({
    status: 200,
    description: "Successfully retrieved promo code.",
  })
  public async getSinglePromoCode(
    @Param("promo_code_id", ParseIntPipe) promoCodeId: number,
  ) {
    return await this.promoCodesService.findPromoCodeById(promoCodeId);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a new promo code" })
  @ApiBody({ type: CreatePromoCodeDto })
  @ApiOkResponse({
    status: 201,
    description: "Successfully created promo code.",
  })
  @ApiBadRequestResponse({ status: 400, description: "Invalid input data." })
  @ApiForbiddenResponse({ status: 403, description: "Forbidden." })
  @ApiUnauthorizedResponse({ status: 401, description: "Unauthorized." })
  public async createPromoCode(@Body() body: CreatePromoCodeDto) {
    return await this.promoCodesService.createPromoCode(body);
  }

  @Patch(":promo_code_id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update an existing promo code" })
  @ApiParam({ name: "promo_code_id", type: Number })
  @ApiBody({ type: UpdatePromoCodeDto })
  @ApiOkResponse({
    status: 201,
    description: "Successfully updated promo code.",
  })
  @ApiNotFoundResponse({ status: 404, description: "Promo Code not Found." })
  @ApiBadRequestResponse({ status: 400, description: "Invalid input data." })
  @ApiForbiddenResponse({ status: 403, description: "Forbidden." })
  @ApiUnauthorizedResponse({ status: 401, description: "Unauthorized." })
  public async updatePromoCode(
    @Param("promo_code_id", ParseIntPipe) promoCodeId: number,
    @Body() body: CreatePromoCodeDto,
  ) {
    return await this.promoCodesService.updatePromoCode(promoCodeId, body);
  }

  @Delete("remove_expired")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Remove all expired and non-active promo codes" })
  @ApiOkResponse({
    status: 200,
    description: "Successfully delete all expired promo codes.",
  })
  @ApiNotFoundResponse({ status: 404, description: "Promo Code not Found." })
  @ApiForbiddenResponse({ status: 403, description: "Forbidden." })
  @ApiUnauthorizedResponse({ status: 401, description: "Unauthorized." })
  public async clearAllNonActivePromoCodes() {
    return await this.promoCodesService.clearAllNonActivePromoCodes();
  }

  @Delete(":promo_code_id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete a promo code by ID" })
  @ApiParam({ name: "promo_code_id", type: Number })
  @ApiOkResponse({
    status: 200,
    description: "Successfully deleted promo code.",
  })
  @ApiNotFoundResponse({ status: 404, description: "Promo Code not Found." })
  @ApiForbiddenResponse({ status: 403, description: "Forbidden." })
  @ApiUnauthorizedResponse({ status: 401, description: "Unauthorized." })
  public async deletePromoCode(
    @Param("promo_code_id", ParseIntPipe) promoCodeId: number,
  ) {
    return await this.promoCodesService.deletePromoCode(promoCodeId);
  }
}
