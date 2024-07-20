import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNumberString,
  IsOptional,
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

  @ApiProperty({
    description: "The address for the user. Must be a valid address.",
    example: "Egypt, Cairo",
    type: String,
    title: "Address",
  })
  @IsOptional()
  @IsString()
  address: string;
}
