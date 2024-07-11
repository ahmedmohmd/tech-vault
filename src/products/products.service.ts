import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductImage } from './product-image.entity';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly productsImagesRepository: Repository<ProductImage>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  public async createProduct(
    productData: CreateProductDto,
    productScreenshots: Array<Express.Multer.File>,
  ) {
    const createdProduct = await this.productsRepository.create(productData);

    if (productScreenshots.length > 0) {
      for (const screenshot of productScreenshots) {
        const uploadedImage = await this.fileUploadService.uploadImage({
          path: `e-commerce/images/products/${productData.name}`,
          file: screenshot,
        });

        const createdImage = await this.productsImagesRepository.create({
          imagePublicId: uploadedImage?.public_id,
          url: uploadedImage?.secure_url,
        });

        await this.productsImagesRepository.save(createdImage);

        createdProduct.productScreenshots.push(createdImage);
      }
    }

    await this.productsRepository.save(createdProduct);

    return createdProduct;
  }
}
