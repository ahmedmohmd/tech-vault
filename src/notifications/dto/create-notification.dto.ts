import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsNumber()
  message: string;
}
