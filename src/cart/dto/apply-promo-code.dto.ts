import { IsNotEmpty, IsString } from 'class-validator';

export class ApplyPromoCodeDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
