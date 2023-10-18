import { FetchUserById } from "../../../../../domain/use-cases/user/fetch-user-by-id/fetch-user-by-id";
import { KnexAccountRepository } from "../../../../../infra/database/postgres/repositories/account-repository";

export const makeFetchUserByIdModules = (): FetchUserById => {
  const accountRepository = new KnexAccountRepository();
  return new FetchUserById(accountRepository);
};
