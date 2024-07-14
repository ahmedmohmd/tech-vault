import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { BcryptService } from './bcrypt/bcrypt.service';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/category.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { FileUploadModule } from './file-upload/file-upload.module';
import { MailModule } from './mail/mail.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { OrderItem } from './orders/order-item.entity';
import { Order } from './orders/order.entity';
import { OrdersModule } from './orders/orders.module';
import { ProductImage } from './products/product-image.entity';
import { Product } from './products/product.entity';
import { ProductsModule } from './products/products.module';
import { UserImage } from './users/user-image.entity';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  providers: [BcryptService, CloudinaryService],
  imports: [
    UsersModule,
    AuthModule,
    BcryptModule,
    MailModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '95123574',
      database: 'e-commerce',
      entities: [
        User,
        UserImage,
        Product,
        ProductImage,
        Category,
        Order,
        OrderItem,
      ],
      synchronize: true,
    }),
    CloudinaryModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
  ],
})
export class AppModule {}
