import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class EmailDto {
	@ApiProperty({
		description: "The email address of the user. Must be a valid email format.",
		example: "ahmed@example.com",
		type: String,
		title: "Email",
	})
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	email: string;
}
