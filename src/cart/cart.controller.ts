import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/common/decorators/user/user.decorator';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add')
  async addItem(@User() user, @Body() Body: CreateCartItemDto) {
    return await this.cartService.addItemToCart(user?.userId, Body);
  }

  @Patch(':itemId')
  async updateItem(
    @User() user,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return await this.cartService.updateCartItem(
      user?.userId,
      itemId,
      updateCartItemDto,
    );
  }

  @Delete(':itemId')
  async removeItem(@User() user, @Param('itemId') itemId: number) {
    return await this.cartService.deleteCartItem(user?.userId, itemId);
  }

  @Get('summary')
  getCartSummary(@User() user) {
    return this.cartService.getCartSummary(user?.userId);
  }

  @Post('checkout')
  async checkout(@User() user) {
    return await this.cartService.handlePayments(user?.userId);
  }

  @Post('clear')
  public async clearCart(@User() user) {
    return await this.cartService.clearCart(user?.userId);
  }
}
