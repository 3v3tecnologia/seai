import { FetchUserAccountByTokenUseCase } from "../../../../../domain/use-cases/user/fetch-user-account-by-token/fetch-user-account-by-token";
import { JwtAdapter } from "../../../../../infra/cryptography/jwt-adapter";
import { AccountRepository } from "../../../../../infra/database/postgres/repositories/account-repository";
import env from "../../../env";

export const makeFetchAccountByToken = (): FetchUserAccountByTokenUseCase => {
  const accountRepository = new AccountRepository();
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  return new FetchUserAccountByTokenUseCase(accountRepository, jwtAdapter);
};
