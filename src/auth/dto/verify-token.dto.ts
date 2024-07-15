import { IsJWT, IsString } from 'class-validator';

export class VerifyTokenDto {
  @IsString()
  verificationToken: string;
}
