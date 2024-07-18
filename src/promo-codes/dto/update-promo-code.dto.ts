import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePromoCodeDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  discount: number;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  expirationDate: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  usageLimit: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  usageCount: number;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  isActive: number;
}
