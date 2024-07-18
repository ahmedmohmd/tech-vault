import {
  IsBooleanString,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { IOrder, ISortAttributes } from '../enums/query-params.enum';

export class GetAllUsersQueryDto {
  @IsOptional()
  @IsNumberString()
  @IsNotEmpty()
  page: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  limit: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ISortAttributes)
  @IsString()
  sortBy: ISortAttributes;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(IOrder)
  @IsString()
  order: IOrder;

  @IsNotEmpty()
  @IsOptional()
  @IsBooleanString()
  verified: string;
}
