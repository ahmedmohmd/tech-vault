import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ApplyPromoCodeDto {
	@ApiProperty({
		description: "The promo code to be applied.",
		example: "SUMMER2024",
		type: String,
	})
	@IsNotEmpty()
	@IsString()
	code: string;
}
