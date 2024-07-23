import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrdersModule } from "../orders/orders.module";
import { PaymentsModule } from "../payments/payments.module";
import { ProductsModule } from "../products/products.module";
import { PromoCodesModule } from "../promo-codes/promocodes.module";
import { UsersModule } from "../users/users.module";
import { CartItem } from "./cart-item.entity";
import { CartController } from "./cart.controller";
import { Cart } from "./cart.entity";
import { CartService } from "./cart.service";

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [
    UsersModule,
    ProductsModule,
    PaymentsModule,
    OrdersModule,
    PromoCodesModule,
    TypeOrmModule.forFeature([CartItem, Cart]),
  ],
})
export class CartModule {}
