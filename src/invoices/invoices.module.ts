import { Module } from "@nestjs/common";
import { OrdersModule } from "../orders/orders.module";
import { UsersModule } from "../users/users.module";
import { InvoicesController } from "./invoices.controller";
import { InvoicesService } from "./invoices.service";

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService],
  imports: [OrdersModule, UsersModule],
})
export class InvoicesModule {}
