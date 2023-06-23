import { DeleteUser } from "../../../../../domain/use-cases/user/delete-user/delete-user";
import { AccountRepository } from "../../../../../infra/database/postgres/repositories/account-repository";

export const makeDeleteUser = (): DeleteUser => {
  const accountRepository = new AccountRepository();
  return new DeleteUser(accountRepository);
};
