import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsStrongPassword } from "class-validator";

export class ResetPasswordDto {
	@ApiProperty({
		description:
			"The new password for the user. Must be a strong password containing letters, numbers, and special characters.",
		example: "Hga^%43@dS21a",
		type: String,
		title: "New Password",
	})
	@IsStrongPassword()
	@IsString()
	password: string;
}
