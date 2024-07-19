import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    required: false,
    description: 'Return Page.',
    minimum: 1,
    default: 1,
    type: Number,
  })
  @IsOptional()
  @IsNumberString()
  @IsNotEmpty()
  page: string;

  @ApiProperty({
    required: false,
    description: 'How much user You Need?',
    minimum: 1,
    default: 12,
    type: Number,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  limit: string;

  @ApiProperty({
    required: false,
    description: 'Sorting Options.',
    default: ISortAttributes.createdAt,
    type: ISortAttributes,
    enum: ISortAttributes,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ISortAttributes)
  @IsString()
  sortBy: ISortAttributes;

  @ApiProperty({
    required: false,
    description: 'Ordering',
    default: IOrder.ASC,
    type: IOrder,
    enum: IOrder,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(IOrder)
  @IsString()
  order: IOrder;

  @ApiProperty({
    required: false,
    description: 'Filter Users by Verified Field.',
    type: Boolean,
  })
  @IsNotEmpty()
  @IsOptional()
  @IsBooleanString()
  verified: string;
}
