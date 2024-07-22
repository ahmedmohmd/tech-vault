import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UploadImage } from "src/common/decorators/upload-image/upload-image.decorator";
import { User } from "src/common/decorators/user/user.decorator";
import { Serialize } from "src/common/interceptors/serialize/serialize.decorator";
import { Roles } from "./decorators/roles.decorator";
import { EmailDto } from "./dto/email.dto";
import { GetAllUsersQueryDto } from "./dto/get-all-users-query.dto";
import { PhoneDto } from "./dto/phone-number.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserDto } from "./dto/user.dto";
import { Role } from "./enums/user-role.enum";
import { UsersService } from "./users.service";

@ApiBearerAuth()
@ApiTags("Users")
@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "Get all Registered Users." })
  @ApiOkResponse({
    isArray: true,
    schema: {
      example: [
        {
          id: 1,
          firstName: "Ahmed",
          lastName: "Muhammad",
          email: "ahmed.muhammad@example.com",
          userImage: "https://example.com/images/ahmed.jpg",
          verified: true,
          createdAt: "2023-06-15T12:00:00.000Z",
          updatedAt: "2024-06-15T12:00:00.000Z",
        },
        {
          id: 2,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          userImage: "https://example.com/images/john.jpg",
          verified: false,
          createdAt: "2023-05-20T08:30:00.000Z",
          updatedAt: "2024-05-20T08:30:00.000Z",
        },
      ],
    },
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number for pagination",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Number of users per page",
  })
  @ApiForbiddenResponse({
    description: "Forbidden.",
    schema: {
      example: "Forbidden.",
    },
  })
  @ApiUnauthorizedResponse({
    description: "UnAuthorized.",
    schema: {
      example: "Unauthorized.",
    },
  })
  @Serialize(UserDto)
  @Roles(Role.ADMIN)
  @Get()
  public async getAllUsers(@Query() query: GetAllUsersQueryDto) {
    return await this.usersService.getAllUsers(query);
  }

  @ApiOperation({ summary: "Get single User." })
  @ApiOkResponse({
    schema: {
      example: {
        id: 1,
        firstName: "Ahmed",
        lastName: "Muhammad",
        email: "ahmed.muhammad@example.com",
        userImage: "https://example.com/images/ahmed.jpg",
        verified: true,
        createdAt: "2023-06-15T12:00:00.000Z",
        updatedAt: "2024-06-15T12:00:00.000Z",
      },
    },
  })
  @ApiForbiddenResponse({
    description: "Forbidden.",
    schema: {
      example: "Forbidden.",
    },
  })
  @ApiUnauthorizedResponse({
    description: "UnAuthorized.",
    schema: {
      example: "Unauthorized.",
    },
  })
  @ApiNotFoundResponse({
    description: "Found Exception.",
    schema: {
      example: "User not Found.",
    },
  })
  @Serialize(UserDto)
  @Roles(Role.USER)
  @Get("/me")
  public async getSingleUser(@User() user) {
    return await this.usersService.getSingleUser(user?.userId);
  }

  @ApiOperation({ summary: "Update Registered User." })
  @ApiOkResponse({
    schema: {
      example: {
        id: 1,
        firstName: "Ahmed",
        lastName: "Muhammad",
        email: "ahmed.muhammad@example.com",
        userImage: "https://example.com/images/ahmed.jpg",
        verified: true,
        createdAt: "2023-06-15T12:00:00.000Z",
        updatedAt: "2024-06-15T12:00:00.000Z",
      },
    },
  })
  @ApiForbiddenResponse({
    description: "Forbidden.",
    schema: {
      example: "Forbidden.",
    },
  })
  @ApiUnauthorizedResponse({
    description: "UnAuthorized.",
    schema: {
      example: "Unauthorized.",
    },
  })
  @ApiNotFoundResponse({
    description: "Found Exception.",
    schema: {
      example: "User not Found.",
    },
  })
  @UploadImage("image")
  @Patch("/me")
  async updateUser(
    @User() user,
    @Body() body: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      return await this.usersService.updateUser(user?.userId, body, file);
    } catch (error) {
      console.error(`Internal Server Error: ${error}`);
      throw new InternalServerErrorException("Internal server error.");
    }
  }

  @ApiOperation({ summary: "Delete a single existing User." })
  @ApiOkResponse({
    schema: {
      example: {
        id: 1,
        firstName: "Ahmed",
        lastName: "Muhammad",
        email: "ahmed.muhammad@example.com",
        userImage: "https://example.com/images/ahmed.jpg",
        verified: true,
        createdAt: "2023-06-15T12:00:00.000Z",
        updatedAt: "2024-06-15T12:00:00.000Z",
      },
    },
  })
  @ApiForbiddenResponse({
    description: "Forbidden.",
    schema: {
      example: "Forbidden.",
    },
  })
  @ApiUnauthorizedResponse({
    description: "UnAuthorized.",
    schema: {
      example: "Unauthorized.",
    },
  })
  @ApiNotFoundResponse({
    description: "Found Exception.",
    schema: {
      example: "User not Found.",
    },
  })
  @Delete("/me")
  public async deleteUser(@User() user) {
    return await this.usersService.deleteUser(user?.userId);
  }

  @Post("add_email")
  public async addEmailToUser(@User() user, @Body() body: EmailDto) {
    return await this.usersService.addEmail(user?.userId, body.email);
  }

  @Delete("delete_email")
  public async deleteEmailFromUser(@User() user, @Body() body: EmailDto) {
    return await this.usersService.deleteEmail(user?.userId, body.email);
  }

  @Post("make_email_primary")
  public async makeEmailPrimary(@User() user, @Body() body: EmailDto) {
    return await this.usersService.makeEmailPrimary(user?.userId, body.email);
  }

  @Post("add_phone_number")
  public async addPhoneNumber(@User() user, @Body() body: PhoneDto) {
    return await this.usersService.addPhoneNumber(
      user?.userId,
      body.phoneNumber,
    );
  }

  @Delete("delete_phone_number")
  public async deletePhoneNumberFromUser(@User() user, @Body() body: PhoneDto) {
    return await this.usersService.deletePhoneNumber(
      user?.userId,
      body.phoneNumber,
    );
  }

  @Post("make_phone_number_primary")
  public async makePhoneNumberPrimary(@User() user, @Body() body: PhoneDto) {
    return await this.usersService.makePhoneNumberPrimary(
      user?.userId,
      body.phoneNumber,
    );
  }
}
