import { EmailService } from "../../../domain/use-cases/_data/services/mail-service";
import env from "../env";

export function getEmailOptions(): EmailService.EmailOptions {
  return {
    host: env.mailer.host || "",
    port: env.mailer.port,
    username: env.mailer.username || "",
    password: env.mailer.password || "",
    from: env.mailer.from || "",
    to: "",
    subject: "",
    text: "",
    html: "",
    attachments: [],
  };
}
