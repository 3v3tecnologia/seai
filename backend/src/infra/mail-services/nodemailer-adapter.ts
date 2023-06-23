import { Either, left, right } from "./../../shared/Either";
import * as nodemailer from "nodemailer";
import { MailServiceError } from "../../domain/use-cases/errors/mail-service-error";
import {
  EmailServiceProtocol,
  EmailService,
} from "../../domain/use-cases/ports/email-service";

export class NodemailerEmailService implements EmailServiceProtocol {
  async send(
    options: EmailService.EmailOptions
  ): Promise<Either<MailServiceError, EmailService.EmailOptions>> {
    try {
      const transporter = nodemailer.createTransport({
        host: options.host,
        port: options.port,
        auth: {
          user: options.username,
          pass: options.password,
        },
      });
      await transporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      });

      return right(options);
    } catch (error) {
      console.error("[Error] ", error);
      return left(new MailServiceError(error as Error));
    }
  }
}
