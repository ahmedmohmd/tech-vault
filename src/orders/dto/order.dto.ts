import { Expose, Transform } from 'class-transformer';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderItem } from '../order-item.entity';

export class OrderDto {
  @Expose()
  id: number;

  @Expose()
  status: OrderStatus;

  @Expose()
  total: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // @Transform(({ obj }) =>
  //   obj.items.map((item) => ({
  //     itemId: item.id,
  //     productId: item.product.id,
  //   })),
  // )
  @Expose()
  items: OrderItem[];

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
