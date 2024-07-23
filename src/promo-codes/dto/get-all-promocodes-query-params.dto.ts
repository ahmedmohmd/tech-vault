import {
  IsBooleanString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

enum SortBy {
  usageCount = "usageCount",
  usageLimit = "usageLimit",
  discount = "discount",
}

enum OrderBy {
  DESC = "DESC",
  ASC = "ASC",
}

export class GetAllPromoCodesQueryParamsDto {
  @IsOptional()
  @IsNotEmpty()
  @IsBooleanString()
  active: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(SortBy)
  @IsString()
  sortBy: SortBy;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(OrderBy)
  @IsString()
  order: OrderBy;
}
