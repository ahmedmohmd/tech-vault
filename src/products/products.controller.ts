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
  UploadedFiles,
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
import { UploadImages } from "../common/decorators/upload-images.decorator";
import { Public } from "../users/decorators/public.decorator";
import { Roles } from "../users/decorators/roles.decorator";
import { Role } from "../users/enums/user-role.enum";
import { RolesGuard } from "../users/guards/roles.guard";
import { CreateProductDto } from "./dto/create-product.dto";
import { GetAllProductsQueryDto } from "./dto/get-all-products-query.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductsService } from "./products.service";

@ApiBearerAuth()
@ApiTags("Products")
@Controller("products")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(":product_id")
  @Public()
  @ApiOperation({ summary: "Get a single Product by ID" })
  @ApiParam({ name: "product_id", type: Number })
  @ApiNotFoundResponse({ status: 404, description: "Product not Found." })
  @ApiForbiddenResponse({ status: 403, description: "Forbidden." })
  @ApiUnauthorizedResponse({ status: 401, description: "Unauthorized." })
  @ApiOkResponse({
    status: 200,
    description: "Successfully retrieved Product.",
  })
  public async getProduct(
    @Param("product_id", ParseIntPipe) productId: number,
  ) {
    return await this.productsService.getProduct(productId);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: "Get all Products." })
  @ApiOkResponse({
    status: 200,
    description: "Successfully retrieved Products.",
  })
  @ApiForbiddenResponse({ status: 403, description: "Forbidden." })
  @ApiUnauthorizedResponse({ status: 401, description: "Unauthorized." })
  public async getAllProducts(@Query() query: GetAllProductsQueryDto) {
    return await this.productsService.getAllProducts(query);
  }

  @UploadImages("productScreenshots", 4)
  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a new Product" })
  @ApiBody({ type: CreateProductDto })
  @ApiOkResponse({
    status: 201,
    description: "Successfully created Product.",
  })
  @ApiBadRequestResponse({ status: 400, description: "Invalid input data." })
  @ApiForbiddenResponse({ status: 403, description: "Forbidden." })
  @ApiUnauthorizedResponse({ status: 401, description: "Unauthorized." })
  public async createProduct(
    @Body() body: CreateProductDto,
    @UploadedFiles() screenshots: Array<Express.Multer.File>,
  ) {
    return await this.productsService.createProduct(body, screenshots);
  }

  @UploadImages("productScreenshots", 4)
  @Patch(":product_id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update an existing Product" })
  @ApiParam({ name: "product_id", type: Number })
  @ApiBody({ type: UpdateProductDto })
  @ApiOkResponse({
    status: 201,
    description: "Successfully updated Product.",
  })
  @ApiNotFoundResponse({ status: 404, description: "Product not Found." })
  @ApiBadRequestResponse({ status: 400, description: "Invalid input data." })
  @ApiForbiddenResponse({ status: 403, description: "Forbidden." })
  @ApiUnauthorizedResponse({ status: 401, description: "Unauthorized." })
  public async updateProduct(
    @Param("product_id", ParseIntPipe) productId: number,
    @Body() body: UpdateProductDto,
    @UploadedFiles() screenshots: Array<Express.Multer.File>,
  ) {
    return await this.productsService.updateProduct(
      productId,
      body,
      screenshots,
    );
  }

  @Delete(":product_id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete a Product." })
  @ApiParam({ name: "product_id", type: Number })
  @ApiOkResponse({
    status: 200,
    description: "Successfully deleted Product.",
  })
  @ApiNotFoundResponse({
    status: 404,
    description: "Product Not Found not Found.",
  })
  @ApiForbiddenResponse({ status: 403, description: "Forbidden." })
  @ApiUnauthorizedResponse({ status: 401, description: "Unauthorized." })
  public async deleteProduct(
    @Param("product_id", ParseIntPipe) productId: number,
  ) {
    return await this.productsService.deleteProduct(productId);
  }

  @Delete(":product_id/screenshots/:screenshot_id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete a Product's Screenshot" })
  @ApiParam({ name: "product_id", type: Number })
  @ApiParam({ name: "screenshot_id", type: Number })
  @ApiOkResponse({
    status: 200,
    description: "Successfully deleted screenshot.",
  })
  @ApiNotFoundResponse({ status: 404, description: "Screenshot not Found." })
  @ApiNotFoundResponse({
    status: 404,
    description: "Product Not Found not Found.",
  })
  @ApiForbiddenResponse({ status: 403, description: "Forbidden." })
  @ApiUnauthorizedResponse({ status: 401, description: "Unauthorized." })
  public async deleteProductScreenshot(
    @Param("product_id", ParseIntPipe) productId: number,
    @Param("screenshot_id", ParseIntPipe) screenshotId: number,
  ) {
    return await this.productsService.deleteProductScreenshot(
      productId,
      screenshotId,
    );
  }
}
