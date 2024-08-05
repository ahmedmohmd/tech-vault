import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class SignInDto {
	@ApiProperty({
		description:
			"The email address of the user signing in. Must be a valid email format.",
		example: "john@example.com",
		type: String,
		title: "Email",
	})
	@IsEmail()
	@IsString()
	email: string;

	@ApiProperty({
		description: "The password for the user. Must be a non-empty string.",
		example: "Hga^%43@dS21a",
		type: String,
		title: "Password",
	})
	@IsString()
	password: string;
}
