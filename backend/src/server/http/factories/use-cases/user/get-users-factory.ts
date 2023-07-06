import { GetUsers } from "../../../../../domain/use-cases/user/get-users/get-users";
import { KnexAccountRepository } from "../../../../../infra/database/postgres/repositories/account-repository";

export const makeGetUsers = (): GetUsers => {
  const accountRepository = new KnexAccountRepository();
  return new GetUsers(accountRepository);
};
