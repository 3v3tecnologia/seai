import { Encoder } from "../../../../../domain/use-cases/_ports/cryptography/encoder";
import { Either, left, right } from "../../../../../shared/Either";
import { UserRepositoryProtocol } from "../../infra/database/repository/protocol/user-repository";
import { UserNotFoundError } from "../../model/errors/user-not-found-error";
import { WrongPasswordError } from "../../model/errors/wrong-password";
import {
  AuthenticationDTO,
  AuthenticationService,
} from "./ports/authentication-service";
import { TokenProvider } from "./ports/token-provider";

export class UserAuthentication implements AuthenticationService {
  private readonly accountRepository: UserRepositoryProtocol;
  private readonly encoder: Encoder;
  private readonly tokenProvider: TokenProvider;

  constructor(
    accountRepository: UserRepositoryProtocol,
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
    Either<UserNotFoundError | WrongPasswordError, AuthenticationDTO.result>
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
