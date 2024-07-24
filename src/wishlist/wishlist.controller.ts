import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { User } from "../common/decorators/user/user.decorator";
import { WishlistService } from "./wishlist.service";

@ApiTags("Wishlist")
@Controller("wishlist")
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: "View User's Wishlist" })
  @ApiNotFoundResponse({ status: 404, description: "User Code not Found." })
  @ApiForbiddenResponse({ status: 403, description: "Forbidden." })
  @ApiUnauthorizedResponse({ status: 401, description: "Unauthorized." })
  @ApiOkResponse({
    status: 200,
    description: "Successfully retrieved Wishlist.",
  })
  public async viewWishlist(@User() user) {
    return this.wishlistService.viewWishlist(user?.userId);
  }

  @Post(":product_id")
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
  public async addToWishlist(
    @User() user,
    @Param("product_id") productId: number,
  ) {
    return await this.wishlistService.addToWishlist(user?.userId, productId);
  }

  @Delete(":product_id")
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
  public async deleteFromWishlist(
    @User() user,
    @Param("product_id") productId: number,
  ) {
    return await this.wishlistService.removeFromWishlist(
      user?.userId,
      productId,
    );
  }
}
