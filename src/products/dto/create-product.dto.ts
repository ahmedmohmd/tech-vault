import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  description: string;

  @IsNumberString()
  price: number;

  @IsNumberString()
  categoryId: number;
}
