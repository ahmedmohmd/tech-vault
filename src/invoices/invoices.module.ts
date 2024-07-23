import { Module } from "@nestjs/common";
import { OrdersModule } from "../orders/orders.module";
import { InvoicesController } from "./invoices.controller";
import { InvoicesService } from "./invoices.service";

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService],
  imports: [OrdersModule],
})
export class InvoicesModule {}
