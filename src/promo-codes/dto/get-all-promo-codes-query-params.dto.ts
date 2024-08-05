import { ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsBooleanString,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from "class-validator";

enum SortBy {
	usageCount = "usageCount",
	usageLimit = "usageLimit",
	discount = "discount",
}

enum OrderBy {
	DESC = "DESC",
	ASC = "ASC",
}

export class GetAllPromoCodesQueryParamsDto {
	@ApiPropertyOptional({
		description: "Promo Code Active Filter Value.",
		example: true,
		type: Boolean,
		title: "Active",
	})
	@IsOptional()
	@IsNotEmpty()
	@IsBooleanString()
	active: boolean;

	@ApiPropertyOptional({
		description: "Field to sort by.",
		example: "createdAt",
		enum: SortBy,
		title: "Sort By",
	})
	@IsOptional()
	@IsNotEmpty()
	@IsEnum(SortBy)
	@IsString()
	sortBy: SortBy;

	@ApiPropertyOptional({
		description: "Order direction.",
		example: "ASC",
		enum: OrderBy,
		title: "Order",
	})
	@IsOptional()
	@IsNotEmpty()
	@IsEnum(OrderBy)
	@IsString()
	order: OrderBy;
}
