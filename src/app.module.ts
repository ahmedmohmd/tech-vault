import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { BcryptService } from './bcrypt/bcrypt.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { FileUploadModule } from './file-upload/file-upload.module';
import { MailModule } from './mail/mail.module';
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
      entities: [User, UserImage, Product, ProductImage],
      synchronize: true,
    }),
    CloudinaryModule,
    ProductsModule,
  ],
})
export class AppModule {}
