import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsNotEmpty, IsString } from "class-validator";

export class PhoneDto {
	@ApiProperty({
		description: "The Phone Number of the user. Must be a valid Phone format.",
		example: "+20 1036544787",
		type: String,
		title: "Phone",
	})
	@IsMobilePhone("ar-EG")
	@IsString()
	@IsNotEmpty()
	phoneNumber: string;
}
