import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoriesModule } from "../categories/categories.module";
import { FileUploadModule } from "../file-upload/file-upload.module";
import { UsersModule } from "../users/users.module";
import { ProductImage } from "./product-image.entity";
import { Product } from "./product.entity";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

@Module({
  controllers: [ProductsController],
  imports: [
    FileUploadModule,
    TypeOrmModule.forFeature([Product, ProductImage]),
    CategoriesModule,
    UsersModule,
  ],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
