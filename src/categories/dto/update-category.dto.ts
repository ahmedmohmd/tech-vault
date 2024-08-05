import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
	@ApiPropertyOptional({
		description: "The name of the category.",
		example: "Electronics",
		type: String,
		required: false,
	})
	@IsNotEmpty()
	@IsOptional()
	@IsString()
	name: string;

	@ApiPropertyOptional({
		description: "The description of the category.",
		example: "Category for electronic products.",
		type: String,
		required: false,
	})
	@IsOptional()
	@IsString()
	description: string;
}
