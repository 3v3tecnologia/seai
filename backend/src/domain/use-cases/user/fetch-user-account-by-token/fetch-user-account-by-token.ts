import { JwtAdapter } from "../../../../infra/cryptography/jwt-adapter";
import { AccountRepository } from "../../../../infra/database/postgres/repositories/account-repository";
import {
  FetchUserAccountByTokenUseCaseProtocol,
  FetchUserAccountByToken,
} from "../../protocols/fetch-user-account-by-token";

export class FetchUserAccountByTokenUseCase
  implements FetchUserAccountByTokenUseCaseProtocol
{
  private readonly fetchUserAccountByToken: AccountRepository;
  private readonly tokenDecrypt: JwtAdapter;

  constructor(fetchUserAccountByToken: any, tokenDecrypt: any) {
    this.fetchUserAccountByToken = fetchUserAccountByToken;
    this.tokenDecrypt = tokenDecrypt;
  }

  async load(
    accessToken: string,
    role?: string | undefined
  ): Promise<FetchUserAccountByToken.Result | null> {
    let token: string | null;

    try {
      // irá verificar se o token é válido e irá tentar extrair o payload dele
      token = await this.tokenDecrypt.verify(accessToken);
    } catch (error) {
      console.error(error);
      // token inválido
      return null;
    }

    if (token) {
      const user = await this.fetchUserAccountByToken.loadByToken(token, role);

      if (user) {
        return user;
      }
    }

    return null;
  }
}
