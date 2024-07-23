import { IsEnum, IsNumberString, IsOptional, IsString } from "class-validator";

export class GetAllProductsQueryDto {
  @IsOptional()
  @IsNumberString()
  category: number;

  @IsOptional()
  @IsString()
  @IsEnum(["price", "name"])
  sortBy: string;

  @IsOptional()
  @IsString()
  @IsEnum(["ASC", "DESC"])
  order: string;
}
