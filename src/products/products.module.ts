import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from 'src/categories/categories.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { ProductImage } from './product-image.entity';
import { Product } from './product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  imports: [
    FileUploadModule,
    TypeOrmModule.forFeature([Product, ProductImage]),
    CategoriesModule,
  ],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
