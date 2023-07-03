import { ForgotPassword } from "../../../../../domain/use-cases/user/send-forgot-password/forgot-password";
import { JwtAdapter } from "../../../../../infra/cryptography/jwt-adapter";
import { AccountRepository } from "../../../../../infra/database/postgres/repositories/account-repository";
import env from "../../../env";
import { DateProvider } from "./../../../../../infra/dateprovider/date";
import { makeSendEmailToUser } from "./send-email-to-user-factory";

export const makeForgotPasswordUser = (): ForgotPassword => {
  const accountRepository = new AccountRepository();
  const dateProvider = new DateProvider();
  const tokenProvider = new JwtAdapter(env.jwtSecret);
  return new ForgotPassword(
    accountRepository,
    makeSendEmailToUser(),
    dateProvider,
    tokenProvider
  );
};
