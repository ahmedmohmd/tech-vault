import { IsNumberString, IsOptional, IsString } from "class-validator";

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumberString()
  price: number;
}
