import { ApiProperty } from "@nestjs/swagger";
import {
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsString,
} from "class-validator";

export class CreateProductDto {
	@ApiProperty({
		description: "Product Name.",
		example: "Iphone 6",
		type: String,
		title: "Name",
	})
	@IsString()
	name: string;

	@ApiProperty({
		description: "Product Description.",
		example:
			"The latest iPhone model with a powerful processor and advanced camera.",
		type: String,
		title: "Description",
	})
	@IsNotEmpty()
	@IsOptional()
	@IsString()
	description: string;

	@ApiProperty({
		description: "Product Price.",
		example: "999.99",
		type: Number,
		title: "Price",
	})
	@IsNumberString()
	price: number;

	@ApiProperty({
		description: "Product Category ID.",
		example: "5",
		type: Number,
		title: "Category ID",
	})
	@IsNumberString()
	categoryId: number;
}
