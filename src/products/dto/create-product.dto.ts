import { IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumberString()
  price: number;

  @IsNumberString()
  categoryId: number;
}
