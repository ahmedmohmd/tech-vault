import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  ],
  providers: [ProductsService],
})
export class ProductsModule {}
