import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
	makeCounterProvider,
	makeGaugeProvider,
	PrometheusModule,
} from "@willsoto/nestjs-prometheus";
import constantsConfig from "configs/constants.config";
import { WinstonModule } from "nest-winston";
import { AuthModule } from "./auth/auth.module";
import { BcryptModule } from "./bcrypt/bcrypt.module";
import { BcryptService } from "./bcrypt/bcrypt.service";
import { CartItem } from "./cart/cart-item.entity";
import { Cart } from "./cart/cart.entity";
import { CartModule } from "./cart/cart.module";
import { CategoriesModule } from "./categories/categories.module";
import { Category } from "./categories/category.entity";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";
import { CloudinaryService } from "./cloudinary/cloudinary.service";
import { InvoicesModule } from "./invoices/invoices.module";
import { RequestLoggingMiddleware } from "./logging/middleware/logging.middleware";
import winstonConfigs from "./logging/winston.config";
import { MailModule } from "./mail/mail.module";
import { CustomMetricsMiddleware } from "./metrics/metrics.middleware";
import { Notification } from "./notifications/notification.entity";
import { NotificationsModule } from "./notifications/notifications.module";
import { OrderItem } from "./orders/order-item.entity";
import { Order } from "./orders/order.entity";
import { OrdersModule } from "./orders/orders.module";
import { PaymentsModule } from "./payments/payments.module";
import { ProductImage } from "./products/product-image.entity";
import { Product } from "./products/product.entity";
import { ProductsModule } from "./products/products.module";
import { PromoCode } from "./promo-codes/promo-code.entity";
import { PromoCodesModule } from "./promo-codes/promo-codes.module";
import { Review } from "./reviews/review.entity";
import { ReviewsModule } from "./reviews/reviews.module";
import { Address } from "./users/address.entity";
import { Email } from "./users/email.entity";
import { Phone } from "./users/phone.entity";
import { UserImage } from "./users/user-image.entity";
import { User } from "./users/user.entity";
import { UsersModule } from "./users/users.module";
import { Wishlist } from "./wishlist/wishlist.entity";
import { WishlistModule } from "./wishlist/wishlist.module";

@Module({
	providers: [
		BcryptService,
		CloudinaryService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},

		makeCounterProvider({
			name: "count",
			help: "metric_help",
			labelNames: ["method", "origin"] as string[],
		}),
		makeGaugeProvider({
			name: "gauge",
			help: "metric_help",
		}),
	],
	imports: [
		UsersModule,
		AuthModule,
		BcryptModule,
		MailModule.forRoot(),
		CloudinaryModule,
		ProductsModule,
		CategoriesModule,
		OrdersModule,
		PaymentsModule,
		CartModule,
		InvoicesModule,
		ReviewsModule,
		NotificationsModule.forRoot(),
		PromoCodesModule,
		WishlistModule,
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ThrottlerModule.forRoot([
			{
				ttl: 60000,
				limit: 90000,
			},
		]),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: "postgres",
				host: configService.get("DATABASE_HOST"),
				port:
					parseInt(configService.get("DATABASE_PORT"), 10) ||
					constantsConfig.POSTGRES_DEFAULT_PORT,
				username: configService.get("DATABASE_USER"),
				password: configService.get("DATABASE_PASSWORD"),
				database: configService.get("DATABASE_NAME"),
				entities: [
					User,
					UserImage,
					Product,
					ProductImage,
					Category,
					Order,
					OrderItem,
					Cart,
					CartItem,
					Review,
					Notification,
					PromoCode,
					Wishlist,
					Email,
					Phone,
					Address,
				],
				synchronize: true,
			}),
		}),

		PrometheusModule.register({
			path: "/metrics",
		}),

		WinstonModule.forRoot(winstonConfigs),
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CustomMetricsMiddleware).forRoutes("*");
		consumer.apply(RequestLoggingMiddleware).forRoutes("*");
	}
}
