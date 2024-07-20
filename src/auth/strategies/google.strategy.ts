import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>("GOOGLE_AUTH_CLIENT_ID"),
      clientSecret: configService.get<string>("GOOGLE_AUTH_CLIENT_SECRET"),
      callbackURL: configService.get<string>("GOOGLE_AUTH_CALLBACK_URL"),
      scope: ["email", "profile"],
    });
  }

  authorizationParams(): { [key: string]: string } {
    return {
      access_type: "offline",
      prompt: "consent",
    };
  }

  async validate(_: string, __: string, profile: any, done: any) {
    const { name, emails, photos } = profile;

    const user = {
      firstName: name.givenName,
      lastName: name.familyName,
      email: emails[0].value,
      picture: photos[0].value,
    };

    done(null, user);
  }
}
