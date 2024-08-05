import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class VerifyTokenDto {
	@ApiProperty({
		description: "The token used for verification. Must be a non-empty string.",
		example: "ahgfatqrynvafd",
		type: String,
		title: "Verification Token",
	})
	@IsString()
	verificationToken: string;
}
