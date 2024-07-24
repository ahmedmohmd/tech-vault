import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateNotificationDto {
  @ApiProperty({
    description: "The message content of the notification.",
    example: "You have a new message.",
    type: String,
  })
  @IsNotEmpty()
  @IsNumber()
  message: string;
}
