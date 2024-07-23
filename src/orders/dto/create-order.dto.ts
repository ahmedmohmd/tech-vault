import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from "class-validator";
import { OrderItemDto } from "./order-item.dto";

export class CreateOrderDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  items: OrderItemDto[];

  @IsOptional()
  @IsNumber()
  discount: number;
}
