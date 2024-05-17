import { Either, left, right } from "../../../../shared/Either";
import { Encoder } from "../../_ports/cryptography/encoder";
import { AccountRepositoryProtocol } from "../../_ports/repositories/account-repository";
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
