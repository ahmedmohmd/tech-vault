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
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UploadImage } from "../common/decorators/upload-image/upload-image.decorator";
import { User } from "../common/decorators/user/user.decorator";
import { Serialize } from "../common/interceptors/serialize/serialize.decorator";
import { Roles } from "./decorators/roles.decorator";
import { EmailDto } from "./dto/email.dto";
import { GetAllUsersQueryDto } from "./dto/get-all-users-query.dto";
import { PhoneDto } from "./dto/phone-number.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserDto } from "./dto/user.dto";
import { Role } from "./enums/user-role.enum";
import { RolesGuard } from "./guards/roles.guard";
import { UsersService } from "./users.service";

@ApiBearerAuth()
@ApiTags("Users")
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Serialize(UserDto)
  @Roles(Role.ADMIN)
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
  @ApiInternalServerErrorResponse({
    status: 500,
    description: "Internal server error",
  })
  public async getAllUsers(@Query() query: GetAllUsersQueryDto) {
    return await this.usersService.getAllUsers(query);
  }

  @Get("/me")
  @Serialize(UserDto)
  @Roles(Role.ADMIN, Role.ADMIN)
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
  @ApiInternalServerErrorResponse({
    status: 500,
    description: "Internal server error",
  })
  public async getSingleUser(@User() user) {
    return await this.usersService.getSingleUser(user?.userId);
  }

  @UploadImage("image")
  @Patch("/me")
  @Roles(Role.ADMIN, Role.ADMIN)
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
  @ApiInternalServerErrorResponse({
    status: 500,
    description: "Internal server error",
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
      throw new InternalServerErrorException("Internal server error.");
    }
  }

  @Delete("/me")
  @Roles(Role.ADMIN, Role.USER)
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
  @ApiInternalServerErrorResponse({
    status: 500,
    description: "Internal server error",
  })
  public async deleteUser(@User() user) {
    return await this.usersService.deleteUser(user?.userId);
  }

  @Post("add_email")
  @Roles(Role.ADMIN, Role.ADMIN)
  @ApiOperation({ summary: "Add an email to the user." })
  @ApiOkResponse({
    description: "Email added successfully.",
    schema: {
      example: "Email added successfully.",
    },
  })
  @ApiForbiddenResponse({
    description: "Forbidden.",
    schema: {
      example: "Forbidden.",
    },
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized.",
    schema: {
      example: "Unauthorized.",
    },
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: "Internal server error.",
  })
  public async addEmailToUser(@User() user, @Body() body: EmailDto) {
    return await this.usersService.addEmail(user?.userId, body.email);
  }

  @Delete("delete_email")
  @Roles(Role.ADMIN, Role.ADMIN)
  @ApiOperation({ summary: "Delete an email from the user." })
  @ApiOkResponse({
    description: "Email deleted successfully.",
    schema: {
      example: "Email deleted successfully.",
    },
  })
  @ApiForbiddenResponse({
    description: "Forbidden.",
    schema: {
      example: "Forbidden.",
    },
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized.",
    schema: {
      example: "Unauthorized.",
    },
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: "Internal server error.",
  })
  public async deleteEmailFromUser(@User() user, @Body() body: EmailDto) {
    return await this.usersService.deleteEmail(user?.userId, body.email);
  }

  @Post("make_email_primary")
  @Roles(Role.ADMIN, Role.ADMIN)
  @ApiOperation({ summary: "Make an email primary for the user." })
  @ApiOkResponse({
    description: "Email set as primary successfully.",
    schema: {
      example: "Email set as primary successfully.",
    },
  })
  @ApiForbiddenResponse({
    description: "Forbidden.",
    schema: {
      example: "Forbidden.",
    },
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized.",
    schema: {
      example: "Unauthorized.",
    },
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: "Internal server error.",
  })
  public async makeEmailPrimary(@User() user, @Body() body: EmailDto) {
    return await this.usersService.makeEmailPrimary(user?.userId, body.email);
  }

  @Post("add_phone_number")
  @Roles(Role.ADMIN, Role.ADMIN)
  @ApiOperation({ summary: "Add a phone number to the user." })
  @ApiOkResponse({
    description: "Phone number added successfully.",
    schema: {
      example: "Phone number added successfully.",
    },
  })
  @ApiForbiddenResponse({
    description: "Forbidden.",
    schema: {
      example: "Forbidden.",
    },
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized.",
    schema: {
      example: "Unauthorized.",
    },
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: "Internal server error.",
  })
  public async addPhoneNumber(@User() user, @Body() body: PhoneDto) {
    return await this.usersService.addPhoneNumber(
      user?.userId,
      body.phoneNumber,
    );
  }

  @Delete("delete_phone_number")
  @Roles(Role.ADMIN, Role.ADMIN)
  @ApiOperation({ summary: "Delete a phone number from the user." })
  @ApiOkResponse({
    description: "Phone number deleted successfully.",
    schema: {
      example: "Phone number deleted successfully.",
    },
  })
  @ApiForbiddenResponse({
    description: "Forbidden.",
    schema: {
      example: "Forbidden.",
    },
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized.",
    schema: {
      example: "Unauthorized.",
    },
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: "Internal server error.",
  })
  public async deletePhoneNumberFromUser(@User() user, @Body() body: PhoneDto) {
    return await this.usersService.deletePhoneNumber(
      user?.userId,
      body.phoneNumber,
    );
  }

  @Post("make_phone_number_primary")
  @Roles(Role.ADMIN, Role.ADMIN)
  @ApiOkResponse({
    description: "Phone number set as primary successfully.",
    schema: {
      example: "Phone number set as primary successfully.",
    },
  })
  @ApiForbiddenResponse({
    description: "Forbidden.",
    schema: {
      example: "Forbidden.",
    },
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized.",
    schema: {
      example: "Unauthorized.",
    },
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: "Internal server error.",
  })
  public async makePhoneNumberPrimary(@User() user, @Body() body: PhoneDto) {
    return await this.usersService.makePhoneNumberPrimary(
      user?.userId,
      body.phoneNumber,
    );
  }
}
