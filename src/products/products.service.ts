import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Multer } from 'multer';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './product-image.entity';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productsImagesRepository: Repository<ProductImage>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  public async getProduct(productId: number) {
    const isProductExists = await this.isProductExists(productId);

    if (!isProductExists) {
      throw new NotFoundException('Product not Found!');
    }

    return await this.productsRepository.findOne({
      where: {
        id: productId,
      },

      relations: ['productScreenshots'],
    });
  }

  public async isProductExists(productId: number) {
    return await this.productsRepository.exists({
      where: {
        id: productId,
      },
    });
  }

  public async createProduct(
    productData: CreateProductDto,
    productScreenshots: Array<Express.Multer.File>,
  ) {
    const createdProduct = await this.productsRepository.create({
      ...productData,
      productScreenshots: [],
    });

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

  public async updateProduct(
    productId: number,
    productData?: UpdateProductDto,
    productScreenshots?: Array<Express.Multer.File>,
  ) {
    const isProductExists = await this.isProductExists(productId);

    if (!isProductExists) {
      throw new NotFoundException('Product not Found!');
    }

    const targetProduct = await this.productsRepository.findOne({
      where: {
        id: productId,
      },

      relations: ['productScreenshots'],
    });

    const updatedProduct = Object.assign(targetProduct, { ...productData });

    if (productScreenshots?.length > 0) {
      const existingScreenshotsCount =
        targetProduct?.productScreenshots?.length;
      const newScreenshotsCount = productScreenshots.length;

      if (existingScreenshotsCount + newScreenshotsCount > 4) {
        throw new BadRequestException(
          'Product can have a maximum of 4 image screenshots.',
        );
      }

      for (const file of productScreenshots) {
        const uploadedImage = await this.fileUploadService.uploadImage({
          path: `e-commerce/images/products/${updatedProduct.name}`,
          file,
        });

        const createdImage = this.productsImagesRepository.create({
          imagePublicId: uploadedImage?.public_id,
          url: uploadedImage?.secure_url,
        });

        const savedProductScreenshot =
          await this.productsImagesRepository.save(createdImage);

        updatedProduct.productScreenshots.push(savedProductScreenshot);
      }
    }

    const savedProduct = await this.productsRepository.save(updatedProduct);

    return savedProduct;
  }

  public async deleteProduct(productId: number) {
    const isProductExists = await this.isProductExists(productId);

    if (!isProductExists) {
      throw new NotFoundException('Product not Found!');
    }

    const targetProduct = await this.productsRepository.findOne({
      where: {
        id: productId,
      },

      relations: ['productScreenshots'],
    });

    if (targetProduct.productScreenshots?.length > 0) {
      for (const image of targetProduct.productScreenshots) {
        await this.fileUploadService.removeImage(image.imagePublicId);
      }
    }

    return await this.productsRepository.remove(targetProduct);
  }

  public async isProductScreenshotExists(screenshotId: number) {
    return await this.productsImagesRepository.exists({
      where: {
        id: screenshotId,
      },
    });
  }

  public async deleteProductScreenshot(productId: number, imageId: number) {
    const isProductExists = await this.isProductExists(productId);

    if (!isProductExists) {
      throw new NotFoundException('Product not Found!');
    }

    const isProductScreenshotExists =
      await this.isProductScreenshotExists(imageId);

    if (!isProductScreenshotExists) {
      throw new NotFoundException('Product Screenshot not Found!');
    }

    const targetProductScreenshot = await this.productsImagesRepository.findOne(
      {
        where: {
          id: imageId,
        },
      },
    );

    await this.fileUploadService.removeImage(
      targetProductScreenshot.imagePublicId,
    );

    return await this.productsImagesRepository.remove(targetProductScreenshot);
  }
}
