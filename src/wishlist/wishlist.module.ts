import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsModule } from "../products/products.module";
import { UsersModule } from "../users/users.module";
import { WishlistController } from "./wishlist.controller";
import { Wishlist } from "./wishlist.entity";
import { WishlistService } from "./wishlist.service";

@Module({
  controllers: [WishlistController],
  providers: [WishlistService],
  imports: [ProductsModule, UsersModule, TypeOrmModule.forFeature([Wishlist])],
})
export class WishlistModule {}
