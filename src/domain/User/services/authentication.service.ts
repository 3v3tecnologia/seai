import { Either, left, right } from "../../../shared/Either";
import { Encoder } from "../../../shared/ports/encoder";
import { InactivatedAccount } from "../core/errors/account-not-activated";
import { UserNotFoundError } from "../core/errors/user-not-found-error";
import { WrongPasswordError } from "../core/errors/wrong-password";
import { Email } from "../core/model/email";
import { UserRepositoryProtocol } from "../infra/repositories/protocol/gov-user-repository";
import { TokenProvider } from "../infra/token-provider";
import { AuthServiceInput, AuthServiceOutput, IAuthService } from "./protocols/authentication";


export class AuthService implements IAuthService {
    constructor(
        private readonly accountRepository: UserRepositoryProtocol,
        private readonly tokenProvider: TokenProvider,
        private readonly encoder: Encoder,
    ) { }

    async auth({
        login,
        password,
    }: AuthServiceInput): AuthServiceOutput {
        const account = Email.validate(login) ? await this.accountRepository.getByEmail(login, "registered") : await this.accountRepository.getByLogin(login, "registered")

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