import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Repository } from "typeorm";
import { Logger } from "winston";
import { MailService } from "../mail/mail.service";
import { NotificationsService } from "../notifications/notifications.service";
import { OrdersService } from "../orders/orders.service";
import { PaymentsService } from "../payments/payments.service";
import { ProductsService } from "../products/products.service";
import { PromoCodesService } from "../promo-codes/promo-codes.service";
import { UsersService } from "../users/users.service";
import { CartItem } from "./cart-item.entity";
import { Cart } from "./cart.entity";
import { CreateCartItemDto } from "./dto/cart-item.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";

@Injectable()
export class CartService {
	constructor(
		@InjectRepository(Cart)
		private readonly cartRepository: Repository<Cart>,
		@InjectRepository(CartItem)
		private readonly cartItemsRepository: Repository<CartItem>,
		private readonly usersService: UsersService,
		private readonly productsService: ProductsService,
		private readonly ordersService: OrdersService,
		private readonly paymentsService: PaymentsService,
		private readonly promoCodesService: PromoCodesService,
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		private readonly mailService: MailService,
		private readonly notificationsService: NotificationsService
	) {}

	public async findOrCreateCart(userId: number) {
		this.logger.info(
			`findOrCreateCart called with User that have id: ${userId}`
		);

		const isCartExists = await this.isCartExists(userId);

		if (isCartExists) {
			this.logger.info(
				`Cart for the user with id: ${userId} founded and returned successfully.`
			);

			return await this.cartRepository.findOne({
				where: {
					user: {
						id: userId,
					},
				},

				relations: ["items", "user", "items.product"],
			});
		}

		const targetUser = await this.usersService.findUser(userId);

		if (!targetUser) {
			this.logger.info(`User with id: ${userId} not Found.`);
			throw new NotFoundException("User not found.");
		}

		const createdCart = this.cartRepository.create({
			user: targetUser,
			items: [],
			discount: 0,
		});

		this.logger.info(`New Cart are created and returned Successfully.`);
		return await this.cartRepository.save(createdCart);
	}

	public async addItemToCart(
		userId: number,
		{ productId, quantity }: CreateCartItemDto
	) {
		this.logger.info(
			`Adding item to cart for userId: ${userId}, productId: ${productId}, quantity: ${quantity}`
		);
		const targetCart = await this.findOrCreateCart(userId);

		// check if the product is exists or not
		const targetProduct = await this.productsService.getProduct(productId);

		if (!targetProduct) {
			this.logger.error(
				`Product with ID ${productId} not found for userId ${userId}.`
			);
			throw new NotFoundException("Product not found.");
		}

		// check if the item is in the cart or not
		let itemFromCart = targetCart.items.find(
			(item) => item.product.id === productId
		);

		if (itemFromCart) {
			itemFromCart.quantity += quantity;
			this.logger.info(
				`Updated quantity for product ID ${productId} to ${itemFromCart.quantity} in cart for userId ${userId}.`
			);
		} else {
			itemFromCart = this.cartItemsRepository.create({
				product: targetProduct,
				cart: targetCart,
				quantity: quantity,
			});

			targetCart.items.push(itemFromCart);
			this.logger.info(
				`Added new item to cart with product ID ${productId} for userId ${userId}.`
			);
		}

		await this.cartItemsRepository.save(itemFromCart);

		return await this.cartRepository.save(targetCart);
	}

	public async updateCartItem(
		userId: number,
		itemId: number,
		{ quantity }: UpdateCartItemDto
	) {
		this.logger.info(
			`Updating cart item for userId: ${userId}, itemId: ${itemId}, quantity: ${quantity}`
		);

		const targetCart = await this.findOrCreateCart(userId);
		const itemFromCart = targetCart.items.find((item) => item.id === itemId);

		if (!itemFromCart) {
			this.logger.error(
				`Cart item with ID ${itemId} not found for userId ${userId}.`
			);
			throw new NotFoundException("Cart Item not found.");
		}

		itemFromCart.quantity = quantity;
		this.logger.info(
			`Updated quantity for cart item ID ${itemId} to ${quantity} for userId ${userId}.`
		);

		await this.cartItemsRepository.save(itemFromCart);

		return await this.cartRepository.save(targetCart);
	}

	public async deleteCartItem(userId: number, itemId: number) {
		this.logger.info(
			`Deleting cart item for userId: ${userId}, itemId: ${itemId}`
		);

		const targetCart = await this.findOrCreateCart(userId);
		const cartItemIndex = targetCart.items.findIndex(
			(item) => item.id === itemId
		);
		if (cartItemIndex === -1) {
			this.logger.error(
				`Cart item with ID ${itemId} not found for userId ${userId}.`
			);
			throw new NotFoundException("Cart item not found");
		}

		const [cartItem] = targetCart.items.splice(cartItemIndex, 1);

		await this.cartItemsRepository.remove(cartItem);
		this.logger.info(`Removed cart item ID ${itemId} from userId ${userId}.`);

		return this.cartRepository.save(targetCart);
	}

	public async getCartSummary(userId: number) {
		this.logger.info(`Fetching cart summary for userId: ${userId}`);
		return await this.findOrCreateCart(userId);
	}

	public async clearCart(userId: number) {
		this.logger.info(`Clearing cart for userId: ${userId}`);

		const targetCart = await this.findOrCreateCart(userId);

		await this.cartItemsRepository.remove(targetCart.items);

		targetCart.items = [];
		targetCart.discount = 0;

		await this.cartRepository.save(targetCart);
	}

	public async handlePayments(userId: number) {
		this.logger.info(`Handling payments for userId: ${userId}`);
		const targetUser = await this.usersService.findUser(userId);

		if (!targetUser) {
			this.logger.error(`User not found for userId: ${userId}`);
			throw new NotFoundException("User not found.");
		}

		const targetCart = await this.findOrCreateCart(userId);

		if (targetCart.items.length <= 0) {
			this.logger.error(`Cart is empty for userId: ${userId}`);

			throw new NotFoundException("Your Cart is Empty.");
		}

		const createdOrder = await this.ordersService.createOrder(userId, {
			items: targetCart.items.map((item) => ({
				productId: item.product.id,
				quantity: item.quantity,
			})),
			discount: targetCart.discount,
		});

		await this.notificationsService.createNotification(userId, {
			message: "Your payment is being processed.",
		});
		this.logger.info(
			`Sent in-app notification to userId ${userId} for payment processing.`
		);

		return await this.paymentsService.createPaymentIntent(createdOrder.id);
	}

	public async applyPromoCode(userId: number, promoCode: string) {
		this.logger.info(
			`Applying promo code '${promoCode}' for userId: ${userId}`
		);

		const targetCart = await this.findOrCreateCart(userId);
		if (targetCart.items.length <= 0) {
			this.logger.error(
				`Cart is empty for userId: ${userId}. Promo code application failed.`
			);
			throw new BadRequestException("Cart is Empty.");
		}

		const targetPromoCode =
			await this.promoCodesService.findPromoCodeByCode(promoCode);

		const isValidPromoCode =
			await this.promoCodesService.isValidPromoCode(targetPromoCode);

		if (!isValidPromoCode) {
			this.logger.error(`Promo code '${promoCode}' is not valid.`);
			throw new BadRequestException("Promo Code is Invalid.");
		}

		targetCart.discount += targetPromoCode.discount;

		await this.promoCodesService.updatePromoCode(targetPromoCode.id, {
			usageCount: targetPromoCode.usageCount + 1,
		});

		return await this.cartRepository.save(targetCart);
	}

	public async isCartExists(userId: number) {
		return await this.cartRepository.exists({
			where: {
				user: {
					id: userId,
				},
			},
		});
	}
}
