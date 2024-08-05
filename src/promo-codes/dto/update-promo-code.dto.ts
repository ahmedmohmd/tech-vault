import { ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsBoolean,
	IsDateString,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";

export class UpdatePromoCodeDto {
	@ApiPropertyOptional({
		description: "Promo code string.",
		example: "SUMMER21",
		type: String,
		title: "Code",
	})
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	code: string;

	@ApiPropertyOptional({
		description: "Discount value.",
		example: 20,
		type: Number,
		title: "Discount",
	})
	@IsOptional()
	@IsNotEmpty()
	@IsNumber()
	discount: number;

	@ApiPropertyOptional({
		description: "Expiration date of the promo code.",
		example: "2024-12-31",
		type: String,
		format: "date-time",
		title: "Expiration Date",
	})
	@IsOptional()
	@IsNotEmpty()
	@IsDateString()
	expirationDate: Date;

	@ApiPropertyOptional({
		description: "Usage limit for the promo code.",
		example: 100,
		type: Number,
		title: "Usage Limit",
	})
	@IsOptional()
	@IsNotEmpty()
	@IsNumber()
	usageLimit: number;

	@ApiPropertyOptional({
		description: "Current usage count of the promo code.",
		example: 50,
		type: Number,
		title: "Usage Count",
	})
	@IsOptional()
	@IsNotEmpty()
	@IsNumber()
	usageCount: number;

	@ApiPropertyOptional({
		description: "Indicates if the promo code is active.",
		example: true,
		type: Boolean,
		title: "Is Active",
	})
	@IsOptional()
	@IsNotEmpty()
	@IsBoolean()
	isActive: number;
}
