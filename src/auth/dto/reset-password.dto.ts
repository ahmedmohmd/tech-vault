import { IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @IsStrongPassword()
  @IsString()
  password: string;
}
