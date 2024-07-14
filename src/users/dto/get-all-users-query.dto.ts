import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

enum ISortAttributes {
  createdAt = 'createdAt',
}

enum IFilterAttributes {
  verified = 'verified',
}

enum IOrder {
  ASC = 'asc',
  DSC = 'desc',
}

export class GetAllUsersQueryDto {
  @IsOptional()
  @IsString()
  page: string;

  @IsOptional()
  @IsString()
  limit: string;

  @IsOptional()
  @IsEnum(ISortAttributes)
  @IsString()
  sortBy: ISortAttributes;

  @IsOptional()
  @IsEnum(IOrder)
  @IsString()
  order: IOrder;

  @IsOptional()
  @IsEnum(IFilterAttributes)
  @IsString()
  filterBy: IFilterAttributes;
}
