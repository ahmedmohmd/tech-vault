import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from "class-validator";

enum Order {
  ASC = "ASC",
  DESC = "DESC",
}

enum SortBy {
  PRICE = "prices",
  NAME = "name",
}

export class GetAllProductsQueryDto {
  @IsNotEmpty()
  @IsOptional()
  @IsNumberString()
  category: number;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @IsEnum(SortBy)
  sortBy: SortBy;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @IsEnum(Order)
  order: Order;

  @IsNotEmpty()
  @IsOptional()
  @IsNumberString()
  page_number: number;

  @IsNotEmpty()
  @IsOptional()
  @IsNumberString()
  page_size: number;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  search: string;
}
