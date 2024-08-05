import { ApiProperty } from "@nestjs/swagger";
import {
	IsBooleanString,
	IsEnum,
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsString,
} from "class-validator";
import { IOrder, ISortAttributes } from "../enums/query-params.enum";

export class GetAllUsersQueryDto {
	@ApiProperty({
		required: false,
		description: "Return Page.",
		minimum: 1,
		default: 1,
		type: Number,
		example: 3,
	})
	@IsOptional()
	@IsNumberString()
	@IsNotEmpty()
	page: string;

	@ApiProperty({
		required: false,
		description: "How much user You Need?",
		minimum: 1,
		default: 12,
		type: Number,
		example: 12,
	})
	@IsOptional()
	@IsNotEmpty()
	@IsNumberString()
	limit: string;

	@ApiProperty({
		required: false,
		description: "Sorting Options.",
		default: ISortAttributes.createdAt,
		type: ISortAttributes,
		enum: ISortAttributes,
		example: ISortAttributes.name,
	})
	@IsOptional()
	@IsNotEmpty()
	@IsEnum(ISortAttributes)
	@IsString()
	sortBy: ISortAttributes;

	@ApiProperty({
		required: false,
		description: "Ordering",
		default: IOrder.ASC,
		type: IOrder,
		enum: IOrder,
		example: IOrder.DSC,
	})
	@IsOptional()
	@IsNotEmpty()
	@IsEnum(IOrder)
	@IsString()
	order: IOrder;

	@ApiProperty({
		required: false,
		description: "Filter Users by Verified Field.",
		type: Boolean,
		example: true,
	})
	@IsNotEmpty()
	@IsOptional()
	@IsBooleanString()
	verified: string;
}
