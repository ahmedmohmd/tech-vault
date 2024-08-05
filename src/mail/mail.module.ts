import { MailerModule } from "@nestjs-modules/mailer";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { MailService } from "./mail.service";

@Global()
@Module({
	exports: [MailService],
	providers: [MailService],
})
export class MailModule {
	static forRoot() {
		return {
			module: MailModule,
			exports: [MailService],
			providers: [MailService],
			imports: [
				MailerModule.forRootAsync({
					useFactory: (configService: ConfigService) => ({
						transport: {
							host: configService.get<string>("MAIL_HOST"),
							port: parseInt(configService.get<string>("MAIL_PORT")),
							secure: false,
							service: "gmail",
							auth: {
								user: configService.get<string>("MAIL_USERNAME"),
								pass: configService.get<string>("MAIL_PASSWORD"),
							},
						},

						defaults: {
							from: '"No Reply" <no-reply@gmail.com>',
						},
						template: {
							dir: join(__dirname, "templates"),
							adapter: new EjsAdapter(),
							options: {
								strict: false,
							},
						},
					}),

					inject: [ConfigService],
				}),
			],
		};
	}
}
