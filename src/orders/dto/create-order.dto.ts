import { ApiProperty } from "@nestjs/swagger";
import {
	ArrayNotEmpty,
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
} from "class-validator";
import { OrderItemDto } from "./order-item.dto";

export class CreateOrderDto {
	@ApiProperty({
		description: "List of items in the order.",
		type: [OrderItemDto],
		title: "Items",
		example: [
			{
				productId: 1,
				quantity: 2,
			},
			{
				productId: 2,
				quantity: 1,
			},
		],
	})
	@IsNotEmpty()
	@IsArray()
	@ArrayNotEmpty()
	items: OrderItemDto[];

	@ApiProperty({
		description: "Discount applied to the order.",
		type: Number,
		title: "Discount",
		example: 10,
		required: false,
	})
	@IsOptional()
	@IsNumber()
	discount: number;
}
