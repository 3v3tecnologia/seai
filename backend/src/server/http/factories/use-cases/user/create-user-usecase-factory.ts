import { CreateUser } from "../../../../../domain/use-cases/user/create-user/create-user";
import { AccountRepository } from "../../../../../infra/database/postgres/repositories/account-repository";
import { makeSendEmailToUser } from "./send-email-to-user-factory";

export const makeCreateUser = (): CreateUser => {
  const accountRepository = new AccountRepository();
  return new CreateUser(accountRepository, makeSendEmailToUser());
};
