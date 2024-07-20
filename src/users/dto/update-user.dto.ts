import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  IsStrongPassword,
} from "class-validator";

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    description: "User's First Name.",
    required: false,
    example: "Ahmed",
  })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty({
    type: String,
    description: "User's Last Name.",
    required: false,
    example: "Muhammad",
  })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({
    type: String,
    description: "User's Email.",
    required: false,
    example: "ahmed@example.com",
  })
  @IsOptional()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    type: String,
    description: "User's Password.",
    required: false,
    example: "Ahga%42blnah62",
  })
  @IsOptional()
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
