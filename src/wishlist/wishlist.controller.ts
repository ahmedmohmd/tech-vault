import {
	Controller,
	Delete,
	Get,
	Param,
	Post,
	UseGuards,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { User } from "../common/decorators/user.decorator";
import { Roles } from "../users/decorators/roles.decorator";
import { Role } from "../users/enums/user-role.enum";
import { RolesGuard } from "../users/guards/roles.guard";
import { WishlistService } from "./wishlist.service";

@ApiBearerAuth()
@ApiTags("Wishlist")
@Controller("wishlist")
@UseGuards(JwtAuthGuard, RolesGuard)
export class WishlistController {
	constructor(private readonly wishlistService: WishlistService) {}

	@Get()
	@Roles(Role.ADMIN, Role.USER)
	@ApiOperation({ summary: "View User's Wishlist" })
	@ApiNotFoundResponse({ status: 404, description: "User Code not Found." })
	@ApiForbiddenResponse({ status: 403, description: "Forbidden." })
	@ApiUnauthorizedResponse({ status: 401, description: "Unauthorized." })
	@ApiOkResponse({
		status: 200,
		description: "Successfully retrieved Wishlist.",
	})
	@ApiInternalServerErrorResponse({
		status: 500,
		description: "Internal server error",
	})
	public async viewWishlist(@User() user) {
		return this.wishlistService.viewWishlist(user?.userId);
	}

	@Post(":product_id")
	@Roles(Role.ADMIN, Role.USER)
	@ApiOperation({ summary: "Add Product to User's Wishlist." })
	@ApiParam({ name: "product_id", type: Number })
	@ApiOkResponse({
		status: 201,
		description: "Successfully added Product to User's Wishlist.",
	})
	@ApiNotFoundResponse({ status: 404, description: "User Code not Found." })
	@ApiNotFoundResponse({ status: 404, description: "Product Code not Found." })
	@ApiForbiddenResponse({ status: 403, description: "Forbidden." })
	@ApiUnauthorizedResponse({ status: 401, description: "Unauthorized." })
	@ApiInternalServerErrorResponse({
		status: 500,
		description: "Internal server error",
	})
	public async addToWishlist(
		@User() user,
		@Param("product_id") productId: number
	) {
		return await this.wishlistService.addToWishlist(user?.userId, productId);
	}

	@Delete(":product_id")
	@Roles(Role.ADMIN, Role.USER)
	@ApiOperation({ summary: "Remove Product from User's Wishlist." })
	@ApiParam({ name: "product_id", type: Number })
	@ApiOkResponse({
		status: 200,
		description: "Successfully removed Product from User's Wishlist.",
	})
	@ApiNotFoundResponse({ status: 404, description: "User not Found." })
	@ApiNotFoundResponse({ status: 404, description: "Product not Found." })
	@ApiForbiddenResponse({ status: 403, description: "Forbidden." })
	@ApiUnauthorizedResponse({ status: 401, description: "Unauthorized." })
	@ApiInternalServerErrorResponse({
		status: 500,
		description: "Internal server error",
	})
	public async deleteFromWishlist(
		@User() user,
		@Param("product_id") productId: number
	) {
		return await this.wishlistService.removeFromWishlist(
			user?.userId,
			productId
		);
	}
}
