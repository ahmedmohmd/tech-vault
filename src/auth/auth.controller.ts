import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { UploadImage } from "../common/decorators/upload-image/upload-image.decorator";
import { User } from "../common/decorators/user/user.decorator";
import { AuthService } from "./auth.service";
import { RequestPasswordResetDto } from "./dto/request-password-reset.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";

const dakeTokensResponseBody = {
  jwtToken:
    "eyJhbGciOiAiSFMyNTYiLCAic3RydWIiOiAiY29tcGxldGUiLCAiZXhwIjogIjE2NTYzNTczNTciLCAiaWF0IjogIjE2NTYzNTczMjciLCAidXNlcmlkIjogIjEyMzQ1IiwgInVzZXJuYW1lIjogInRlc3R1c2VyIiwgInJvbGUiOiAiYWRtaW4ifQ.d9K8uR8ZL-ZR2TkwU-1T76A6irfYujM9dQeWajGo4T8",
  jwtRefreshToken:
    "eyJhbGciOiAiSFMyNTYiLCAic3RydWIiOiAiY29tcGxldGUiLCAiZXhwIjogIjE2NTYzNTczNTciLCAiaWF0IjogIjE2NTYzNTczMjciLCAidXNlcmlkIjogIjEyMzQ1IiwgInVzZXJuYW1lIjogInRlc3R1c2VyIiwgInJvbGUiOiAiYWRtaW4ifQ.d9K8uR8ZL-ZR2TkwU-1T76A6irfYujM9dQeWajGo4T8",
};

@ApiBearerAuth()
@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign_up")
  @ApiOperation({ summary: "Sign Up with Credentials" })
  @ApiOkResponse({
    description: "Successful Sign Up",
    schema: {
      example: dakeTokensResponseBody,
    },
  })
  @ApiBadRequestResponse({
    description: "User already exists.",
    schema: {
      example: {
        statusCode: 400,
        message: "User already Exists.",
        error: "Bad Request",
      },
    },
  })
  @UploadImage("image")
  public async signUpWithCredentials(
    @Body() body: SignUpDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.authService.signUpWithCredentials(body, file);
  }

  @Get("verify_email")
  @ApiOperation({ summary: "Verify Email" })
  @ApiOkResponse({
    description: "Email verification successful.",
    schema: {
      example: "dakeTokensResponseBody",
    },
  })
  @ApiNotFoundResponse({
    description: "User not found Error Response.",
    schema: {
      example: {
        statusCode: 404,
        message: "User not Found.",
        error: "Not Found",
      },
    },
  })
  public async verifyEmail(
    @Query("verificationToken") verificationToken: string,
  ) {
    return await this.authService.verifyEmail(verificationToken);
  }

  @Post("sign_in")
  @ApiOperation({ summary: "Sign In with Credentials" })
  @ApiOkResponse({
    description: "Successful Sign In",
    schema: {
      example: dakeTokensResponseBody,
    },
  })
  @ApiNotFoundResponse({
    description: "User not found Error Response.",
    schema: {
      example: {
        statusCode: 404,
        message: "User not Found.",
        error: "Not Found",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Password is incorrect Error Response.",
    schema: {
      example: {
        statusCode: 400,
        message: "Password is Incorrect.",
        error: "Bad Request",
      },
    },
  })
  @Throttle({
    default: {
      limit: 3,
      ttl: 3600000,
    },
  })
  public async SignIn(@Body() body: SignInDto) {
    return await this.authService.signIn(body);
  }

  @ApiOperation({ summary: "Authenticate with Google" })
  @ApiResponse({
    status: 200,
    description: "Redirects to Google for authentication.",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Bad Request.",
  })
  @Get("google")
  @UseGuards(AuthGuard("google"))
  public async googleSignUp() {}

  @Get("google/redirect")
  @UseGuards(AuthGuard("google"))
  @ApiOperation({ summary: "Handle Google Authentication Redirect" })
  @ApiOkResponse({
    description: "Successful Google Authentication",
    schema: {
      example: dakeTokensResponseBody,
    },
  })
  public async googleAuth(@User() user, @Res() res) {
    return await this.authService.authWithGoogle(user, res);
  }

  @Post("request_password_reset")
  @ApiOperation({ summary: "Request Password Reset" })
  @ApiOkResponse({
    description: "Password reset request successful.",
    schema: {
      example: {
        message: "Password reset request sent.",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid email format.",
    schema: {
      example: {
        statusCode: 400,
        message: "Invalid email format.",
        error: "Bad Request",
      },
    },
  })
  public async requestPasswordReset(
    @Body() { email }: RequestPasswordResetDto,
  ) {
    return await this.authService.requestPasswordReset(email);
  }

  @Post("reset_password")
  @ApiOperation({ summary: "Reset Password" })
  @ApiOkResponse({
    description: "Password reset successful.",
    schema: {
      example: {
        message: "Password has been reset successfully.",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid password format.",
    schema: {
      example: {
        statusCode: 400,
        message: "Invalid password format.",
        error: "Bad Request",
      },
    },
  })
  public async resetPassword(
    @Body() body: ResetPasswordDto,
    @Query("resetToken") resetToken: string,
  ) {
    return await this.authService.resetPassword({
      password: body.password,
      resetToken,
    });
  }
}
