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
} from '@nestjs/common';
import { UploadImages } from 'src/common/decorators/upload-image/upload-images.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':productId')
  public async getProduct(@Param('productId', ParseIntPipe) productId: number) {
    return await this.productsService.getProduct(productId);
  }

  @UploadImages('productScreenshots', 4)
  @Post()
  public async createProduct(
    @Body() body: CreateProductDto,
    @UploadedFiles() screenshots: Array<Express.Multer.File>,
  ) {
    return await this.productsService.createProduct(body, screenshots);
  }

  @UploadImages('productScreenshots', 4)
  @Patch(':productId')
  public async updateProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() body: UpdateProductDto,
    @UploadedFiles() screenshots: Array<Express.Multer.File>,
  ) {
    return await this.productsService.updateProduct(
      productId,
      body,
      screenshots,
    );
  }

  @Delete(':productId')
  public async deleteProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return await this.productsService.deleteProduct(productId);
  }

  @Delete(':productId/screenshots/:screenshotId')
  public async deleteProductScreenshot(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('screenshotId', ParseIntPipe) screenshotId: number,
  ) {
    return await this.productsService.deleteProductScreenshot(
      productId,
      screenshotId,
    );
  }
}
