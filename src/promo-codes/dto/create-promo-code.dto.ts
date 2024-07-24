import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePromoCodeDto {
  @ApiProperty({
    description: "Promo Code Value.",
    example: "WIN",
    type: String,
    title: "Code",
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: "Promo Code Discount Value in Dollars.",
    example: 20,
    type: Number,
    title: "Discount",
  })
  @IsNotEmpty()
  @IsNumber()
  discount: number;

  @ApiProperty({
    description: "Promo Code Expiration Date in Value Date String Format.",
    example: "12-1-2020",
    type: Date,
    title: "Expiration Date",
  })
  @IsNotEmpty()
  @IsDateString()
  expirationDate: Date;

  @ApiProperty({
    description: "Promo Code Usage Maximum Limit Value.",
    example: 5,
    type: Number,
    title: "Usage Limit",
  })
  @IsNotEmpty()
  @IsNumber()
  usageLimit: number;
}
