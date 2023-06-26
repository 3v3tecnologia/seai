import { SendEmailToUser } from "../../../../../domain/use-cases/user/send-email-to-user/send-email-to-user";
import { NodemailerEmailService } from "../../../../../infra/mail-services/nodemailer-adapter";
import { getEmailOptions } from "../../../config/email";

export const makeSendEmailToUser = (): SendEmailToUser => {
  const mailerService = new NodemailerEmailService();
  return new SendEmailToUser(mailerService, getEmailOptions());
};
