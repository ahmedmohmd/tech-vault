import { ApiPropertyOptional } from "@nestjs/swagger";
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
  @ApiPropertyOptional({
    description: "Product Category ID.",
    example: "5",
    type: Number,
    title: "Category ID",
  })
  @IsNotEmpty()
  @IsOptional()
  @IsNumberString()
  category: number;

  @ApiPropertyOptional({
    description: "Field to sort the products by.",
    example: "name",
    enum: SortBy,
    title: "Sort By",
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @IsEnum(SortBy)
  sortBy: SortBy;

  @ApiPropertyOptional({
    description: "Sort order for the products.",
    example: "ASC",
    enum: Order,
    title: "Order",
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @IsEnum(Order)
  order: Order;

  @ApiPropertyOptional({
    description: "Page number for pagination.",
    example: "1",
    type: Number,
    title: "Page Number",
  })
  @IsNotEmpty()
  @IsOptional()
  @IsNumberString()
  page_number: number;

  @ApiPropertyOptional({
    description: "Page size for pagination.",
    example: "10",
    type: Number,
    title: "Page Size",
  })
  @IsNotEmpty()
  @IsOptional()
  @IsNumberString()
  page_size: number;

  @ApiPropertyOptional({
    description: "Search query for the products.",
    example: "iPhone",
    type: String,
    title: "Search",
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  search: string;

  @ApiPropertyOptional({
    description: "Minimum price filter for the products.",
    example: "500",
    type: String,
    title: "Min Price",
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  min_price: string;

  @ApiPropertyOptional({
    description: "Maximum price filter for the products.",
    example: "1000",
    type: String,
    title: "Max Price",
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  max_price: string;
}
