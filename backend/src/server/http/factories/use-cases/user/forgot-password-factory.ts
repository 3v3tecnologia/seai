import { ForgotPassword } from "../../../../../domain/use-cases/user/send-forgot-password/forgot-password";
import { AccountRepository } from "../../../../../infra/database/postgres/repositories/account-repository";
import { makeSendEmailToUser } from "./send-email-to-user-factory";

export const makeForgotPasswordUser = (): ForgotPassword => {
  const accountRepository = new AccountRepository();
  return new ForgotPassword(accountRepository, makeSendEmailToUser());
};
