import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { OrdersService } from 'src/orders/orders.service';
import { PaymentsService } from 'src/payments/payments.service';
import { ProductsService } from 'src/products/products.service';
import { PromoCodesService } from 'src/promo-codes/promocodes.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Cart } from './cart.entity';
import { CreateCartItemDto } from './dto/cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

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
  ) {}

  public async findOrCreateCart(userId: number) {
    const isCartExists = await this.isCartExists(userId);

    if (isCartExists) {
      return await this.cartRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },

        relations: ['items', 'user', 'items.product'],
      });
    }

    const targetUser = await this.usersService.findUser(userId);

    if (!targetUser) {
      throw new NotFoundException('User not found.');
    }

    const createdCart = this.cartRepository.create({
      user: targetUser,
      items: [],
      discount: 0,
    });

    return await this.cartRepository.save(createdCart);
  }

  public async addItemToCart(
    userId: number,
    { productId, quantity }: CreateCartItemDto,
  ) {
    const targetCart = await this.findOrCreateCart(userId);

    // check if the product is exists or not
    const targetProduct = await this.productsService.getProduct(productId);

    if (!targetProduct) {
      throw new NotFoundException('Product not found.');
    }

    // check if the item is in the cart or not
    let itemFromCart = targetCart.items.find(
      (item) => item.product.id === productId,
    );

    if (itemFromCart) {
      itemFromCart.quantity += quantity;
    } else {
      itemFromCart = this.cartItemsRepository.create({
        product: targetProduct,
        cart: targetCart,
        quantity: quantity,
      });

      targetCart.items.push(itemFromCart);
    }

    await this.cartItemsRepository.save(itemFromCart);

    return await this.cartRepository.save(targetCart);
  }

  public async updateCartItem(
    userId: number,
    itemId: number,
    { quantity }: UpdateCartItemDto,
  ) {
    const targetCart = await this.findOrCreateCart(userId);
    let itemFromCart = targetCart.items.find((item) => item.id === itemId);

    if (!itemFromCart) {
      throw new NotFoundException('Cart Item not found.');
    }

    itemFromCart.quantity = quantity;

    await this.cartItemsRepository.save(itemFromCart);

    return await this.cartRepository.save(targetCart);
  }

  public async deleteCartItem(userId: number, itemId: number) {
    const targetCart = await this.findOrCreateCart(userId);
    const cartItemIndex = targetCart.items.findIndex(
      (item) => item.id === itemId,
    );
    if (cartItemIndex === -1) {
      throw new NotFoundException('Cart item not found');
    }

    const [cartItem] = targetCart.items.splice(cartItemIndex, 1);

    await this.cartItemsRepository.remove(cartItem);

    return this.cartRepository.save(targetCart);
  }

  public async getCartSummary(userId: number) {
    return await this.findOrCreateCart(userId);
  }

  public async clearCart(userId: number) {
    const targetCart = await this.findOrCreateCart(userId);

    await this.cartItemsRepository.remove(targetCart.items);

    targetCart.items = [];
    targetCart.discount = 0;

    await this.cartRepository.save(targetCart);
  }

  public async handlePayments(userId: number) {
    const targetUser = await this.usersService.findUser(userId);

    if (!targetUser) {
      throw new NotFoundException('User not found.');
    }

    const targetCart = await this.findOrCreateCart(userId);

    if (targetCart.items.length <= 0) {
      throw new NotFoundException('Your Cart is Empty.');
    }

    const createdOrder = await this.ordersService.createOrder({
      userId: userId,
      items: targetCart.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      discount: targetCart.discount,
    });

    return await this.paymentsService.createPaymentIntent(createdOrder.id);
  }

  public async applyPromoCode(userId: number, promoCode: string) {
    const targetCart = await this.findOrCreateCart(userId);
    if (targetCart.items.length <= 0) {
      throw new BadRequestException('Cart is Empty.');
    }

    const targetPromoCode =
      await this.promoCodesService.findPromoCodeByCode(promoCode);

    const isValidPromoCode =
      await this.promoCodesService.isValidPromoCode(targetPromoCode);

    if (!isValidPromoCode) {
      throw new BadRequestException('Promo Code is Invalid.');
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
