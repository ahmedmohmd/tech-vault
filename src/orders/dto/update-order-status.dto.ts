import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { OrderStatus } from "../enums/order-status.enum";

export class UpdateOrderStatusDto {
	@ApiPropertyOptional({
		description: "Status of the order.",
		enum: OrderStatus,
		title: "Order Status",
		example: OrderStatus.SHIPPED,
		required: false,
	})
	@IsNotEmpty()
	@IsOptional()
	@IsEnum(OrderStatus)
	@IsString()
	status: OrderStatus;
}
