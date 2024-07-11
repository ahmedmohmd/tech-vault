import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { BcryptModule } from '../bcrypt/bcrypt.module';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RandomTokenService } from './random-token.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RandomTokenService, JwtStrategy, GoogleStrategy],
  imports: [
    UsersModule,
    BcryptModule,
    MailModule,
    PassportModule,
    FileUploadModule,

    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),

      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
