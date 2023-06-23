import { Either } from "../../../shared/Either";
import { MailServiceError } from "../errors/mail-service-error";

export interface EmailServiceProtocol {
  send: (
    options: EmailService.EmailOptions
  ) => Promise<Either<MailServiceError, EmailService.EmailOptions>>;
}

export namespace EmailService {
  export interface EmailOptions {
    readonly host: string;
    readonly port: number;
    readonly username: string;
    readonly password: string;
    readonly from: string;
    readonly to: string;
    readonly subject: string;
    readonly text: string;
    readonly html: string;
    readonly attachments: Object[];
  }

  export type Result = {};
}
