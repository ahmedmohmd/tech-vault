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
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { User } from "../common/decorators/user.decorator";
import { Roles } from "../users/decorators/roles.decorator";
import { Role } from "../users/enums/user-role.enum";
import { RolesGuard } from "../users/guards/roles.guard";
import { CartService } from "./cart.service";
import { ApplyPromoCodeDto } from "./dto/apply-promo-code.dto";
import { CreateCartItemDto } from "./dto/cart-item.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";

@ApiBearerAuth()
@ApiTags("Cart")
@Controller("cart")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.USER)
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Post("/add")
	@ApiOperation({ summary: "Add an item to the cart." })
	@ApiBody({ type: CreateCartItemDto })
	@ApiResponse({
		status: 201,
		description: "Item added to the cart successfully.",
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized.",
	})
	async addItem(@User() user, @Body() Body: CreateCartItemDto) {
		return await this.cartService.addItemToCart(user?.userId, Body);
	}

	@Patch(":item_id")
	@ApiOperation({ summary: "Update the quantity of an item in the cart." })
	@ApiParam({
		name: "item_id",
		description: "ID of the cart item to update.",
		type: Number,
	})
	@ApiBody({ type: UpdateCartItemDto })
	@ApiResponse({
		status: 200,
		description: "Cart item updated successfully.",
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized.",
	})
	async updateItem(
		@User() user,
		@Param("item_id", ParseIntPipe) itemId: number,
		@Body() updateCartItemDto: UpdateCartItemDto
	) {
		return await this.cartService.updateCartItem(
			user?.userId,
			itemId,
			updateCartItemDto
		);
	}

	@Delete(":item_id")
	@ApiOperation({ summary: "Remove an item from the cart." })
	@ApiParam({
		name: "item_id",
		description: "ID of the cart item to remove.",
		type: Number,
	})
	@ApiResponse({
		status: 200,
		description: "Cart item removed successfully.",
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized.",
	})
	async removeItem(@User() user, @Param("item_id") itemId: number) {
		return await this.cartService.deleteCartItem(user?.userId, itemId);
	}

	@Get("summary")
	@ApiOperation({ summary: "Get a summary of the cart." })
	@ApiResponse({
		status: 200,
		description: "Cart summary retrieved successfully.",
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized.",
	})
	getCartSummary(@User() user) {
		return this.cartService.getCartSummary(user?.userId);
	}

	@Post("checkout")
	@ApiOperation({ summary: "Checkout and handle payment for the cart." })
	@ApiResponse({
		status: 200,
		description: "Checkout process completed successfully.",
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized.",
	})
	async checkout(@User() user) {
		return await this.cartService.handlePayments(user?.userId);
	}

	@Post("clear")
	@ApiOperation({ summary: "Clear all items from the cart." })
	@ApiResponse({
		status: 200,
		description: "Cart cleared successfully.",
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized.",
	})
	public async clearCart(@User() user) {
		return await this.cartService.clearCart(user?.userId);
	}

	@Post("apply-promo-code")
	@ApiOperation({ summary: "Apply a promo code to the cart." })
	@ApiBody({ type: ApplyPromoCodeDto })
	@ApiResponse({
		status: 200,
		description: "Promo code applied successfully.",
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized.",
	})
	public async applyPromoCode(@User() user, @Body() body: ApplyPromoCodeDto) {
		return await this.cartService.applyPromoCode(user?.userId, body.code);
	}
}
