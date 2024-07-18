import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UploadImage } from 'src/common/decorators/upload-image/upload-image.decorator';
import { User } from 'src/common/decorators/user/user.decorator';
import { Serialize } from 'src/common/interceptors/serialize/serialize.decorator';
import { Roles } from './decorators/roles.decorator';
import { GetAllUsersQueryDto } from './dto/get-all-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { Role } from './enums/user-role.enum';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Serialize(UserDto)
  @Roles(Role.ADMIN)
  @Get()
  public async getAllUsers(@Query() query: GetAllUsersQueryDto) {
    return await this.usersService.getAllUsers(query);
  }

  @Get('/me')
  @Serialize(UserDto)
  @Roles(Role.USER)
  public async getSingleUser(@User() user) {
    return await this.usersService.getSingleUser(user?.userId);
  }

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

  @Delete('/me')
  public async deleteUser(@User() user) {
    return await this.usersService.deleteUser(user.userId);
  }
}
