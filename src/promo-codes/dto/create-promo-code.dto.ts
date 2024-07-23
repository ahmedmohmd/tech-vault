import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePromoCodeDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  discount: number;

  @IsNotEmpty()
  @IsDateString()
  expirationDate: Date;

  @IsNotEmpty()
  @IsNumber()
  usageLimit: number;
}
