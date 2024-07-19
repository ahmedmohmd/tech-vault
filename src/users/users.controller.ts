import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Serialize(UserDto)
  @Roles(Role.ADMIN)
  @Get()
  @ApiOkResponse({
    type: [User],
    example: [
      {
        id: 1,
        firstName: 'Ahmed',
        lastName: 'Muhammad',
        email: 'ahmed.muhammad@example.com',
        userImage: 'https://example.com/images/ahmed.jpg',
        verified: true,
        createdAt: '2023-06-15T12:00:00.000Z',
        updatedAt: '2024-06-15T12:00:00.000Z',
      },
      {
        id: 2,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        userImage: 'https://example.com/images/john.jpg',
        verified: false,
        createdAt: '2023-05-20T08:30:00.000Z',
        updatedAt: '2024-05-20T08:30:00.000Z',
      },
    ],
  })
  @ApiForbiddenResponse({
    description: 'Forbidden.',
    example: 'Forbidden.',
    type: ForbiddenException,
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized.',
    example: 'Unauthorized.',
    type: UnauthorizedException,
  })
  public async getAllUsers(@Query() query: GetAllUsersQueryDto) {
    return await this.usersService.getAllUsers(query);
  }

  @Serialize(UserDto)
  @Roles(Role.USER)
  @Get('/me')
  @ApiOkResponse({
    type: User,
    example: {
      id: 1,
      firstName: 'Ahmed',
      lastName: 'Muhammad',
      email: 'ahmed.muhammad@example.com',
      userImage: 'https://example.com/images/ahmed.jpg',
      verified: true,
      createdAt: '2023-06-15T12:00:00.000Z',
      updatedAt: '2024-06-15T12:00:00.000Z',
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden.',
    example: 'Forbidden.',
    type: ForbiddenException,
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized.',
    example: 'Unauthorized.',
    type: UnauthorizedException,
  })
  @ApiNotFoundResponse({
    description: 'Found Exception.',
    example: 'User not Found.',
    type: NotFoundException,
  })
  public async getSingleUser(@User() user) {
    return await this.usersService.getSingleUser(user?.userId);
  }

  @UploadImage('image')
  @Patch('/me')
  @ApiOkResponse({
    type: User,
    example: {
      id: 1,
      firstName: 'Ahmed',
      lastName: 'Muhammad',
      email: 'ahmed.muhammad@example.com',
      userImage: 'https://example.com/images/ahmed.jpg',
      verified: true,
      createdAt: '2023-06-15T12:00:00.000Z',
      updatedAt: '2024-06-15T12:00:00.000Z',
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden.',
    example: 'Forbidden.',
    type: ForbiddenException,
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized.',
    example: 'Unauthorized.',
    type: UnauthorizedException,
  })
  @ApiNotFoundResponse({
    description: 'Found Exception.',
    example: 'User not Found.',
    type: NotFoundException,
  })
  async updateUser(
    @User() user,
    @Body() body: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      return await this.usersService.updateUser(user?.userId, body, file);
    } catch (error) {
      console.error(`Internal Server Error: ${error}`);
      throw new InternalServerErrorException('Internal server error.');
    }
  }

  @ApiOkResponse({
    type: User,
    example: {
      id: 1,
      firstName: 'Ahmed',
      lastName: 'Muhammad',
      email: 'ahmed.muhammad@example.com',
      userImage: 'https://example.com/images/ahmed.jpg',
      verified: true,
      createdAt: '2023-06-15T12:00:00.000Z',
      updatedAt: '2024-06-15T12:00:00.000Z',
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden.',
    example: 'Forbidden.',
    type: ForbiddenException,
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized.',
    example: 'Unauthorized.',
    type: UnauthorizedException,
  })
  @ApiNotFoundResponse({
    description: 'Found Exception.',
    example: 'User not Found.',
    type: NotFoundException,
  })
  @Delete('/me')
  public async deleteUser(@User() user) {
    return await this.usersService.deleteUser(user.userId);
  }
}
