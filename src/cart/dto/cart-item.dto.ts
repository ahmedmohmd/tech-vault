import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateCartItemDto {
	@ApiProperty({
		description: "The ID of the product to be added to the cart.",
		example: 123,
		type: Number,
	})
	@IsNotEmpty()
	@IsNumber()
	productId: number;

	@ApiProperty({
		description: "The quantity of the product to be added to the cart.",
		example: 2,
		type: Number,
	})
	@IsNotEmpty()
	@IsNumber()
	quantity: number;
}
