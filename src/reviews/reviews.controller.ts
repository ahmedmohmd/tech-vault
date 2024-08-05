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
	ApiBearerAuth,
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
import { User } from "../common/decorators/user.decorator";
import { Roles } from "../users/decorators/roles.decorator";
import { Role } from "../users/enums/user-role.enum";
import { RolesGuard } from "../users/guards/roles.guard";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { ReviewsService } from "./reviews.service";

@ApiBearerAuth()
@ApiTags("Reviews")
@Controller("reviews")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewsController {
	constructor(private readonly reviewsService: ReviewsService) {}

	@Post(":product_id")
	@Roles(Role.ADMIN, Role.USER)
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
		@Param("product_id", ParseIntPipe) productId: number
	) {
		return await this.reviewsService.createReview(
			user?.userId,
			productId,
			body
		);
	}

	@Patch(":review_id")
	@Roles(Role.ADMIN, Role.USER)
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
		@Param("review_id", ParseIntPipe) reviewId: number
	) {
		return await this.reviewsService.updateReview(user?.userId, reviewId, body);
	}

	@Delete(":review_id")
	@Roles(Role.ADMIN, Role.USER)
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
		@Param("review_id", ParseIntPipe) reviewId: number
	) {
		return await this.reviewsService.deleteReview(user?.userId, reviewId);
	}
}
