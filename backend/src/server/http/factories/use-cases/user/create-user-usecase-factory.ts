import { CreateUser } from "../../../../../domain/use-cases/user/create-user/create-user";
import { JwtAdapter } from "../../../../../infra/cryptography/jwt-adapter";
import { KnexAccountRepository } from "../../../../../infra/database/postgres/repositories/account-repository";
import { DateProvider } from "../../../../../infra/dateprovider/date";
import env from "../../../env";
import { makeSendNotificationToUser } from "./send-user-account-notification-factory";

export const makeCreateUser = (): CreateUser => {
  const accountRepository = new KnexAccountRepository();
  const tokenProvider = new JwtAdapter(env.jwtSecret);
  const dateProvider = new DateProvider();
  return new CreateUser(
    accountRepository,
    makeSendNotificationToUser(),
    dateProvider,
    tokenProvider
  );
};
