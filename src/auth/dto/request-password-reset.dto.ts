import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class RequestPasswordResetDto {
	@ApiProperty({
		description: "The email address of the user requesting the password reset.",
		example: "john@example.com",
		type: String,
		title: "Email",
	})
	@IsEmail()
	@IsString()
	email: string;
}
