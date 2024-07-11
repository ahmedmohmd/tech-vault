import {
  Body,
  Controller,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  UploadedFile,
} from '@nestjs/common';
import { UploadImage } from 'src/common/decorators/upload-image/upload-image.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('/:userId')
  @UploadImage('image')
  async updateUser(
    @Body() body: UpdateUserDto,
    @Param('userId', ParseIntPipe) userId: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      return await this.usersService.updateUser(userId, body, file);
    } catch (error) {
      console.error(`Internal Server Error: ${error}`);
      throw new InternalServerErrorException('Internal server error.');
    }
  }
}
