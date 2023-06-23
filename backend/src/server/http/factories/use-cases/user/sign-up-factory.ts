import { SignUp } from "../../../../../domain/use-cases/user/sign-up";
import { BcryptAdapter } from "../../../../../infra/cryptography/bcrypt-adapter";
import { AccountRepository } from "../../../../../infra/database/postgres/repositories/account-repository";
import { makeUserAuthentication } from "./authentication-factory";

export const makeUserSignUp = (): SignUp => {
  const accountRepository = new AccountRepository();
  const encoder = new BcryptAdapter();
  return new SignUp(accountRepository, makeUserAuthentication(), encoder);
};
