import { left, right } from "../../../shared/Either";
import { Encoder } from "../../../shared/ports/encoder";
import { InactivatedAccount } from "../core/errors/account-not-activated";
import { UserNotFoundError } from "../core/errors/user-not-found-error";
import { WrongPasswordError } from "../core/errors/wrong-password";
import { Email } from "../core/model/email";
import { UserTypes } from "../core/model/gov-user";
import { IAuthRepository } from "../infra/repository/protocol/auth.repository";
import { TokenProvider } from "../infra/token-provider";
import { AuthServiceInput, AuthServiceOutput, IAuthService } from "./protocols/auth";

export class AuthService implements IAuthService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenProvider: TokenProvider,
    private readonly encoder: Encoder,
  ) { }

  async auth({
    login,
    password,
    type
  }: AuthServiceInput): Promise<AuthServiceOutput> {

    const account = Email.validate(login) ? await this.authRepository.getByEmail(login, type) : await this.authRepository.getByLogin(login, type)

    if (!account) {
      return left(new UserNotFoundError());
    }

    if (account.status === "pending") {
      return left(new InactivatedAccount());
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
