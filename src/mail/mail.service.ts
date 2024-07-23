import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, InternalServerErrorException } from "@nestjs/common";

interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  context?: any;
  template?: string;
}

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  async sendMail({ from, subject, text, to, context, template }: IMailOptions) {
    try {
      return await this.mailService.sendMail({
        from,
        to,
        subject,
        text,
        template: template,
        context: {
          ...context,
        },
      });
    } catch (error) {
      console.error(`Internal Server Error: ${error}`);
      throw new InternalServerErrorException("Internal server error.");
    }
  }
}
