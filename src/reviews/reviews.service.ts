import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  public async createReview(
    userId: number,
    productId: number,
    reviewData: CreateReviewDto,
  ) {
    const targetUser = await this.usersService.findUser(userId);

    if (!targetUser) {
      throw new NotFoundException('User Not Found.');
    }

    const targetProduct = await this.productsService.getProduct(productId);

    if (!targetProduct) {
      throw new NotFoundException('Product Not Found.');
    }

    const userReview = targetProduct.reviews.find((review) => {
      return review.user.id === targetUser.id;
    });

    if (userReview) {
      throw new BadRequestException(
        'Your are review this product in the past.',
      );
    }

    const createdReview = this.reviewsRepository.create({
      ...reviewData,
      user: targetUser,
      product: targetProduct,
    });

    return await this.reviewsRepository.save(createdReview);
  }

  public async updateReview(
    userId: number,
    reviewId: number,
    reviewData: UpdateReviewDto,
  ) {
    const targetUser = await this.usersService.findUser(userId);

    if (!targetUser) {
      throw new NotFoundException('User Not Found.');
    }

    const targetReview = await this.reviewsRepository.findOne({
      where: {
        user: targetUser,
        id: reviewId,
      },
    });

    if (targetReview) {
      throw new NotFoundException('Review Not Found.');
    }

    const updatedReview = Object.assign(targetReview, { ...reviewData });

    return await this.reviewsRepository.save(updatedReview);
  }

  public async deleteReview(userId: number, reviewId: number) {
    const targetUser = await this.usersService.findUser(userId);

    if (!targetUser) {
      throw new NotFoundException('User Not Found.');
    }

    const targetReview = await this.reviewsRepository.findOne({
      where: {
        user: targetUser,
        id: reviewId,
      },
    });

    if (targetReview) {
      throw new NotFoundException('Review Not Found.');
    }

    return await this.reviewsRepository.remove(targetReview);
  }
}
