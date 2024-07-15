import { Module } from '@nestjs/common';
import { OrdersService } from 'src/orders/orders.service';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsService } from './order-items.service';

@Module({
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
  exports: [OrdersService],
})
export class OrderItemsModule {}
