import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { User } from "../common/decorators/user/user.decorator";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { ReviewsService } from "./reviews.service";

@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(":productId")
  public async createReview(
    @User() user,
    @Body() body: CreateReviewDto,
    @Param("productId", ParseIntPipe) productId: number,
  ) {
    return await this.reviewsService.createReview(
      user?.userId,
      productId,
      body,
    );
  }

  @Patch(":reviewId")
  public async updateReview(
    @User() user,
    @Body() body: UpdateReviewDto,
    @Param("reviewId", ParseIntPipe) reviewId: number,
  ) {
    return await this.reviewsService.updateReview(user?.userId, reviewId, body);
  }

  @Delete(":reviewId")
  public async deleteReview(
    @User() user,
    @Param("reviewId", ParseIntPipe) reviewId: number,
  ) {
    return await this.reviewsService.deleteReview(user?.userId, reviewId);
  }
}
