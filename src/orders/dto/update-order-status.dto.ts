import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  @IsString()
  status: OrderStatus;
}
