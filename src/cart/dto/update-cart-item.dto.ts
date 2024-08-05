import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateCartItemDto {
	@ApiPropertyOptional({
		description: "The updated quantity of the product in the cart.",
		example: 3,
		type: Number,
	})
	@IsNotEmpty()
	@IsNumber()
	quantity: number;
}
