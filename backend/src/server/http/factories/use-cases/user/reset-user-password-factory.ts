import { ResetPassword } from "../../../../../domain/use-cases/user/reset-password/reset-password";
import { BcryptAdapter } from "../../../../../infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "../../../../../infra/cryptography/jwt-adapter";
import { KnexAccountRepository } from "../../../../../infra/database/postgres/repositories/account-repository";
import env from "../../../env";

export const makeResetUserPassword = (): ResetPassword => {
  const accountRepository = new KnexAccountRepository();
  const tokenProvider = new JwtAdapter(env.jwtSecret);
  const encoder = new BcryptAdapter();

  return new ResetPassword(accountRepository, tokenProvider, encoder);
};
