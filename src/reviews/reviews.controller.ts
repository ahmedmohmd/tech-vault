import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
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
import { User } from "../common/decorators/user/user.decorator";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { ReviewsService } from "./reviews.service";

@ApiTags("Reviews")
@Controller("reviews")
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(":product_id")
  @ApiOperation({ summary: "Create Product Review." })
  @ApiParam({ name: "product_id", type: Number })
  @ApiBody({ type: CreateReviewDto })
  @ApiOkResponse({
    status: 201,
    description: "Successfully created Product's Review.",
  })
  @ApiForbiddenResponse({ status: 403, description: "Forbidden." })
  @ApiUnauthorizedResponse({ status: 401, description: "Unauthorized." })
  @ApiForbiddenResponse({ status: 403, description: "Forbidden." })
  @ApiBadRequestResponse({ status: 400, description: "Invalid input data." })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: "Internal server error",
  })
  public async createReview(
    @User() user,
    @Body() body: CreateReviewDto,
    @Param("product_id", ParseIntPipe) productId: number,
  ) {
    return await this.reviewsService.createReview(
      user?.userId,
      productId,
      body,
    );
  }

  @Patch(":review_id")
  @ApiOperation({ summary: "Update Single Product Reviews." })
  @ApiParam({ name: "review_id", type: Number })
  @ApiBody({ type: UpdateReviewDto })
  @ApiNotFoundResponse({
    status: 404,
    description: "Product Review not Found.",
  })
  @ApiBadRequestResponse({ status: 400, description: "Invalid input data." })
  @ApiForbiddenResponse({ status: 403, description: "Forbidden." })
  @ApiUnauthorizedResponse({ status: 401, description: "Unauthorized." })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: "Internal server error",
  })
  public async updateReview(
    @User() user,
    @Body() body: UpdateReviewDto,
    @Param("review_id", ParseIntPipe) reviewId: number,
  ) {
    return await this.reviewsService.updateReview(user?.userId, reviewId, body);
  }

  @Delete(":review_id")
  @ApiOperation({ summary: "Delete Single Product Reviews." })
  @ApiParam({ name: "review_id", type: Number })
  @ApiOkResponse({
    status: 200,
    description: "Successfully deleted Product Review.",
  })
  @ApiNotFoundResponse({
    status: 404,
    description: "Product Review not Found.",
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: "Internal server error",
  })
  public async deleteReview(
    @User() user,
    @Param("review_id", ParseIntPipe) reviewId: number,
  ) {
    return await this.reviewsService.deleteReview(user?.userId, reviewId);
  }
}
