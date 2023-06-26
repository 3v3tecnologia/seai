import { UserAuthentication } from "../../../../../domain/use-cases/user/authentication";
import { BcryptAdapter } from "../../../../../infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "../../../../../infra/cryptography/jwt-adapter";
import { AccountRepository } from "../../../../../infra/database/postgres/repositories/account-repository";
import env from "../../../env";

export const makeUserAuthentication = (): UserAuthentication => {
  const accountRepository = new AccountRepository();
  const encoder = new BcryptAdapter();
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  return new UserAuthentication(accountRepository, encoder, jwtAdapter);
};
