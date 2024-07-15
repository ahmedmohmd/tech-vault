import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UploadImage } from '../common/decorators/upload-image/upload-image.decorator';
import { User } from '../common/decorators/user/user.decorator';
import { AuthService } from './auth.service';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @UploadImage('image')
  public async signUpWithCredentials(
    @Body() body: SignUpDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.authService.signUpWithCredentials(body, file);
  }

  @Get('verify-email')
  public async verifyEmail(
    @Query('verificationToken') verificationToken: string,
  ) {
    return await this.authService.verifyEmail(verificationToken);
  }

  @Post('sign-in')
  public async SignIn(@Body() body: SignInDto) {
    return await this.authService.signIn(body);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  public async googleSignUp() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  public async googleAuth(@User() user, @Res() res) {
    return await this.authService.authWithGoogle(user, res);
  }

  @Post('request-password-reset')
  public async requestPasswordReset(
    @Body() { email }: RequestPasswordResetDto,
  ) {
    return await this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  public async resetPassword(
    @Body() body: ResetPasswordDto,
    @Query('resetToken') resetToken: string,
  ) {
    try {
      return await this.authService.resetPassword({
        password: body.password,
        resetToken,
      });
    } catch (error) {
      console.error(`Internal Server Error: ${error}`);
      throw new InternalServerErrorException('Internal server error.');
    }
  }
}
