import { ForgotPassword } from "../../../../../domain/use-cases/user/send-forgot-password/forgot-password";
import { JwtAdapter } from "../../../../../infra/cryptography/jwt-adapter";
import { KnexAccountRepository } from "../../../../../infra/database/postgres/repositories/account-repository";
import env from "../../../env";
import { DateProvider } from "./../../../../../infra/dateprovider/date";
import { makeSendNotificationToUser } from "./send-user-account-notification-factory";

export const makeForgotPasswordUser = (): ForgotPassword => {
  const accountRepository = new KnexAccountRepository();
  const dateProvider = new DateProvider();
  const tokenProvider = new JwtAdapter(env.jwtSecret);
  return new ForgotPassword(
    accountRepository,
    makeSendNotificationToUser(),
    dateProvider,
    tokenProvider
  );
};
