import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsNotEmpty()
  @Max(5)
  @Min(1)
  @IsNumber()
  rating: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  comment: string;
}
