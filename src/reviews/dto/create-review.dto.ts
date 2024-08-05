import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
	@ApiProperty({
		description: "Rating of the Review.",
		example: 4,
		minimum: 1,
		maximum: 5,
		type: Number,
		title: "Rating",
	})
	@IsNotEmpty()
	@Max(5)
	@Min(1)
	@IsNumber()
	rating: number;

	@ApiProperty({
		description: "Comment of the Review.",
		example: "Nice Product.",
		type: String,
		title: "Comment",
	})
	@IsNotEmpty()
	@IsString()
	comment: string;
}
