import { Either, left, right } from "../../../../shared/Either";
import { MailServiceError } from "../../errors/mail-service-error";
import { EmailService, EmailServiceProtocol } from "../../ports/email-service";

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
    html: string
  ): Promise<Either<MailServiceError, string>> {
    // const greetings = "E aí <b>" + user.email + "</b>, beleza?";
    // const customizedHtml = greetings + "<br> <br>" + this.emailOptions.html;

    const options = {
      host: this.emailOptions.host,
      port: this.emailOptions.port,
      username: this.emailOptions.username,
      password: this.emailOptions.password,
      from: this.emailOptions.from,
      to: "<" + user.email + ">",
      subject: this.emailOptions.subject,
      text: this.emailOptions.text,
      html: html,
      attachments: this.emailOptions.attachments,
    };

    const response = await this.emailService.send(options);

    if (response.isLeft()) {
      console.error("Falha ao enviar email para usuário");
      return left(response.value);
    }

    return right(`Sucesso ao enviar email para ${user.email}`);
  }
}
