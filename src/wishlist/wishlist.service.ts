import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductsService } from "../products/products.service";
import { UsersService } from "../users/users.service";
import { Wishlist } from "./wishlist.entity";

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  public async addToWishlist(userId: number, productId: number) {
    const targetUser = await this.usersService.findUser(userId);
    if (!targetUser) {
      throw new NotFoundException("User Not Found.");
    }

    const targetProduct = await this.productsService.getProduct(productId);
    if (!targetProduct) {
      throw new NotFoundException("Product Not Found.");
    }

    const createdWishListItem = this.wishlistRepository.create({
      product: targetProduct,
      user: targetUser,
    });

    return await this.wishlistRepository.save(createdWishListItem);
  }

  public async removeFromWishlist(userId: number, productId: number) {
    const targetWishlistItem = await this.wishlistRepository.findOne({
      where: {
        product: {
          id: productId,
        },

        user: {
          id: userId,
        },
      },
    });

    if (!targetWishlistItem) {
      throw new NotFoundException("Wishlist Not Found.");
    }

    return await this.wishlistRepository.remove(targetWishlistItem);
  }

  public async viewWishlist(userId: number) {
    return await this.wishlistRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }
}
