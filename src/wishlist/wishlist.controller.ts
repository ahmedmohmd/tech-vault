import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { User } from "../common/decorators/user/user.decorator";
import { WishlistService } from "./wishlist.service";

@Controller("wishlist")
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  public async viewWishlist(@User() user) {
    return this.wishlistService.viewWishlist(user?.userId);
  }

  @Post(":productId")
  public async addToWishlist(
    @User() user,
    @Param("productId") productId: number,
  ) {
    return await this.addToWishlist(user?.userId, productId);
  }

  @Delete(":productId")
  public async deleteFromWishlist(
    @User() user,
    @Param("productId") productId: number,
  ) {
    return await this.deleteFromWishlist(user?.userId, productId);
  }
}
