import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsPostalCode,
	IsString,
	IsStrongPassword,
} from "class-validator";

export class SignUpDto {
	@ApiProperty({
		description: "The first name of the user. Must be a non-empty string.",
		example: "Ahmed",
		type: String,
		title: "First Name",
	})
	@IsString()
	firstName: string;

	@ApiProperty({
		description: "The last name of the user. Must be a non-empty string.",
		example: "Muhammad",
		type: String,
		title: "Last Name",
	})
	@IsString()
	lastName: string;

	@ApiProperty({
		description: "The email address of the user. Must be a valid email format.",
		example: "ahmed@example.com",
		type: String,
		title: "Email",
	})
	@IsOptional()
	@IsNotEmpty()
	@IsEmail()
	@IsString()
	email: string;

	@ApiProperty({
		description: "The password for the user. Must be a strong password.",
		example: "Hga^%43@dS21a",
		type: String,
		title: "Password",
	})
	@IsStrongPassword()
	@IsString()
	password: string;

	@ApiProperty({
		description: "The Phone Number for the user. Must be a valid phone number.",
		example: "+20 1223658791",
		type: String,
		title: "Phone Number",
	})
	@IsOptional()
	@IsNumberString()
	@IsString()
	phoneNumber: string;

	// Address Props
	@ApiProperty({
		description: "City of the User.",
		example: "Cairo",
		type: String,
		title: "City",
	})
	@IsNotEmpty()
	@IsOptional()
	@IsString()
	city: string;

	@ApiProperty({
		description: "Post Code of the User's Location.",
		example: "654781",
		type: String,
		title: "Post Code",
	})
	@IsNotEmpty()
	@IsPostalCode()
	@IsOptional()
	@IsString()
	postCode: string;

	@ApiProperty({
		description: "User's Country.",
		example: "Egypt",
		type: String,
		title: "Country",
	})
	@IsNotEmpty()
	@IsOptional()
	@IsString()
	country: string;
}
