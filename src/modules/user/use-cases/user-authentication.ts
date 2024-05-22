
import { Encoder } from "../../../shared/external/cryptography/protocols/encoder";
import { TokenProvider } from "../../../shared/external/cryptography/protocols/token-provider";
import { WrongPasswordError } from "../core/errors/wrong-password";
import { AccountNotFoundError } from "../core/errors/user-account-not-found";
import { AccountRepositoryProtocol } from "../infra/repositories/protocol/user-repository";
import { Either, left, right } from "../../../shared/core/Either";


export class UserAuthentication implements AuthenticationService {
  private readonly accountRepository: AccountRepositoryProtocol;
  private readonly encoder: Encoder;
  private readonly tokenProvider: TokenProvider;

  constructor(
    accountRepository: AccountRepositoryProtocol,
    encoder: Encoder,
    tokenProvider: TokenProvider
  ) {
    this.accountRepository = accountRepository;
    this.encoder = encoder;
    this.tokenProvider = tokenProvider;
  }

  async auth({
    login,
    password,
  }: AuthenticationDTO.params): Promise<
    Either<AccountNotFoundError | WrongPasswordError, AuthenticationDTO.result>
  > {
    const account = await this.accountRepository.getByLogin(login);

    if (!account) {
      return left(new AccountNotFoundError());
    }
    const isMatch = await this.encoder.compare(
      password,
      account.password as string
    );

    if (isMatch === false) {
      return left(new WrongPasswordError());
    }

    const userId = account.id as number;

    const token = await this.tokenProvider.sign(
      {
        accountId: userId,
      },
      "7d"
    );

    return right({
      accessToken: token,
      userName: account.name,
    });
  }
}

export namespace AuthenticationDTO {
  export type params = { login: string; password: string };

  export type result = {
    accessToken: string;
    // accountId: number;
  };
}

export interface AuthenticationService {
  auth(
    params: AuthenticationDTO.params,
    test?: string
  ): Promise<
    Either<AccountNotFoundError | WrongPasswordError, AuthenticationDTO.result>
  >;
}
