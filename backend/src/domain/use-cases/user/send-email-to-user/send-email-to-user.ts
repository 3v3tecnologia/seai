import {
  EmailService,
  EmailServiceProtocol,
} from "../../_ports/services/mail-service";

export class SendEmailToUser {
  private readonly emailService: EmailServiceProtocol;
  private readonly emailOptions: EmailService.EmailOptions;

  constructor(
    emailService: EmailServiceProtocol,
    emailOptions: EmailService.EmailOptions
  ) {
    this.emailService = emailService;
    this.emailOptions = emailOptions;
  }
  async send(
    user: {
      email: string;
    },
    mailerOptions: { html: string; subject: string; text: string }
  ): Promise<void> {
    const options = {
      host: this.emailOptions.host,
      port: this.emailOptions.port,
      username: this.emailOptions.username,
      password: this.emailOptions.password,
      from: this.emailOptions.from,
      to: "<" + user.email + ">",
      subject: mailerOptions.subject,
      text: mailerOptions.text,
      html: mailerOptions.html,
      attachments: [],
    };

    await this.emailService.send(options);
  }
}
