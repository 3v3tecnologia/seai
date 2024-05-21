import { Either, left, right } from "../../../shared/Either";
import { Encoder } from "../_ports/cryptography/encoder";
import { AccountRepositoryProtocol } from "../_ports/repositories/account-repository";

import { TokenProvider } from "../_ports/cryptography/token-provider";
import { WrongPasswordError } from "./errors/wrong-password";
import { AccountNotFoundError } from "./errors/user-account-not-found";
import { UserNotFoundError } from "../errors/user-not-found";

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
      return left(new UserNotFoundError());
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
