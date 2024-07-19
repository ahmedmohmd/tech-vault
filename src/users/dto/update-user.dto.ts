import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    description: `User's First Name.`,
  })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty({
    type: String,
    description: `User's Last Name.`,
  })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({
    type: String,
    description: `User's Email.`,
  })
  @IsOptional()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    type: String,
    description: `User's Password.`,
  })
  @IsOptional()
  @IsStrongPassword()
  @IsString()
  password: string;
}
