import { Body, Controller, Post, UploadedFiles } from '@nestjs/common';
import { UploadImages } from 'src/common/decorators/upload-image/upload-images.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UploadImages('productScreenshots', 4)
  @Post()
  public async createProduct(
    @Body() body: CreateProductDto,
    @UploadedFiles() screenshots: Array<Express.Multer.File>,
  ) {
    return await this.productsService.createProduct(body, screenshots);
  }
}
