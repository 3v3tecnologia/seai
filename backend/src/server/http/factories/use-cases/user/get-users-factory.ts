import { GetUsers } from "../../../../../domain/use-cases/user/get-users/get-users";
import { AccountRepository } from "../../../../../infra/database/postgres/repositories/account-repository";

export const makeGetUsers = (): GetUsers => {
  const accountRepository = new AccountRepository();
  return new GetUsers(accountRepository);
};
