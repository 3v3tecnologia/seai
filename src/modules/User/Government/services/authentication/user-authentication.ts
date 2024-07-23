import { Encoder } from "../../../../../domain/use-cases/_ports/cryptography/encoder";
import { AccountRepositoryProtocol } from "../../infra/database/repository/protocol/user-repository";
import { Either, left, right } from "../../../../../shared/Either";
import { UserNotFoundError } from "../delete-user/errors/user-not-found-error";
import { AccountNotFoundError, WrongPasswordError } from "./errors";
import {
  AuthenticationDTO,
  AuthenticationService,
} from "./ports/authentication-service";
import { TokenProvider } from "./ports/token-provider";

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
    email,
  }: AuthenticationDTO.params): Promise<
    Either<AccountNotFoundError | WrongPasswordError, AuthenticationDTO.result>
  > {
    const account = login
      ? await this.accountRepository.getByLogin(login)
      : await this.accountRepository.getByEmail(email as string);

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