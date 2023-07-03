import { LoaUserModules } from "../../../../../domain/use-cases/user/load_user_access/load_user_access";
import { AccountRepository } from "../../../../../infra/database/postgres/repositories/account-repository";

export const makeGetUsersAccessModules = (): LoaUserModules => {
  const accountRepository = new AccountRepository();
  return new LoaUserModules(accountRepository);
};
