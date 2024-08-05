import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumberString, IsOptional, IsString } from "class-validator";

export class UpdateProductDto {
	@ApiPropertyOptional({
		description: "Name of the product.",
		example: "iPhone 12",
		type: String,
		title: "Name",
	})
	@IsOptional()
	@IsString()
	name: string;

	@ApiPropertyOptional({
		description: "Description of the product.",
		example: "The latest iPhone model from Apple.",
		type: String,
		title: "Description",
	})
	@IsOptional()
	@IsString()
	description: string;

	@ApiPropertyOptional({
		description: "Price of the product.",
		example: "999.99",
		type: Number,
		title: "Price",
	})
	@IsOptional()
	@IsNumberString()
	price: number;
}
