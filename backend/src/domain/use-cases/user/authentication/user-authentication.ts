import { AccountRepository } from "../../../../infra/database/postgres/repositories/account-repository";
import { Either, left, right } from "../../../../shared/Either";
import { Encoder } from "../../../ports/encoder";
import { AccountNotFoundError, WrongPasswordError } from "./errors";
import {
  AuthenticationDTO,
  AuthenticationService,
} from "./ports/authentication-service";
import { TokenProvider } from "./ports/token-provider";

export class UserAuthentication implements AuthenticationService {
  private readonly accountRepository: AccountRepository;
  private readonly encoder: Encoder;
  private readonly tokenProvider: TokenProvider;

  constructor(
    accountRepository: AccountRepository,
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
    const account = await this.accountRepository.loadByLogin(login);

    if (!account) {
      return left(new AccountNotFoundError(login));
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
      // accountId: userId,
    });
  }
}
