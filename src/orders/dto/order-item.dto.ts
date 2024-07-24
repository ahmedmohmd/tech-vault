import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class OrderItemDto {
  @ApiProperty({
    description: "ID of the product.",
    type: Number,
    title: "Product ID",
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({
    description: "Quantity of the product.",
    type: Number,
    title: "Quantity",
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
