import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "../orders/order.entity";
import { UsersModule } from "../users/users.module";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
  imports: [TypeOrmModule.forFeature([Order]), UsersModule],
})
export class PaymentsModule {}
