import * as nodemailer from "nodemailer";
import {
  EmailService,
  EmailServiceProtocol,
} from "../../domain/use-cases/_ports/services/mail-service";

export class NodemailerEmailService implements EmailServiceProtocol {
  async send(options: EmailService.EmailOptions): Promise<void> {
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
  }
}
