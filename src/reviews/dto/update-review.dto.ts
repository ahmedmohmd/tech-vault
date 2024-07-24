import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class UpdateReviewDto {
  @ApiPropertyOptional({
    description: "Rating of the Review.",
    example: 4,
    minimum: 1,
    maximum: 5,
    type: Number,
    title: "Rating",
  })
  @IsOptional()
  @IsNotEmpty()
  @Max(5)
  @Min(1)
  @IsNumber()
  rating: number;

  @ApiPropertyOptional({
    description: "Comment of the Review.",
    example: "Nice Product.",
    type: String,
    title: "Comment",
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  comment: string;
}
