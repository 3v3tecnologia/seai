import { JwtAdapter } from "../../../../infra/cryptography/jwt-adapter";
import { AccountRepository } from "../../../../infra/database/postgres/repositories/account-repository";
import {
  FetchUserAccountByTokenUseCaseProtocol,
  FetchUserAccountByToken,
} from "../../ports/fetch-user-account-by-token";
import { TokenPayload } from "../authentication/ports/token-provider";

export class FetchUserAccountByTokenUseCase
  implements FetchUserAccountByTokenUseCaseProtocol
{
  private readonly userAccountRepository: AccountRepository;
  private readonly tokenDecrypt: JwtAdapter;

  constructor(
    fetchUserAccountByToken: AccountRepository,
    tokenDecrypt: JwtAdapter
  ) {
    this.userAccountRepository = fetchUserAccountByToken;
    this.tokenDecrypt = tokenDecrypt;
  }

  async load(
    accessToken: string,
    role?: string | undefined
  ): Promise<FetchUserAccountByToken.Result | null> {
    let token: TokenPayload | null;

    try {
      // irá verificar se o token é válido e irá tentar extrair o payload dele
      token = await this.tokenDecrypt.verify(accessToken);
      console.log("TOKEN = ", token);
    } catch (error) {
      console.error(error);
      // token inválido
      return null;
    }

    // if (token) {
    //   const user = await this.userAccountRepository.loadByToken(token, role);

    //   if (user) {
    //     return user;
    //   }
    // }

    return null;
  }
}
