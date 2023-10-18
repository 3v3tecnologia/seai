import { UpdateUser } from "../../../../../domain/use-cases/user/update-user";
import { BcryptAdapter } from "../../../../../infra/cryptography/bcrypt-adapter";
import { KnexAccountRepository } from "../../../../../infra/database/postgres/repositories/account-repository";

export const makeUpdateUser = (): UpdateUser => {
  const accountRepository = new KnexAccountRepository();
  const encoder = new BcryptAdapter();
  return new UpdateUser(accountRepository, encoder);
};
