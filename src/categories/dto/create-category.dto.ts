import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({
    description: "The name of the category.",
    example: "Electronics",
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "The description of the category.",
    example: "Category for electronic products.",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;
}
