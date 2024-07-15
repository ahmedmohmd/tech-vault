import { Module } from '@nestjs/common';
import { OrdersModule } from 'src/orders/orders.module';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService],
  imports: [OrdersModule],
})
export class InvoicesModule {}
