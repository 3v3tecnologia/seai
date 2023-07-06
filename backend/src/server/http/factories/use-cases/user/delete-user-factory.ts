import { DeleteUser } from "../../../../../domain/use-cases/user/delete-user/delete-user";
import { KnexAccountRepository } from "../../../../../infra/database/postgres/repositories/account-repository";

export const makeDeleteUser = (): DeleteUser => {
  const accountRepository = new KnexAccountRepository();
  return new DeleteUser(accountRepository);
};
