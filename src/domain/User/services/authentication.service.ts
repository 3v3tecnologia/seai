import { Either, left, right } from "../../../../shared/Either";
import { Encoder } from "../../../../shared/ports/encoder";
import { UserAccountProps, UserRepositoryProtocol } from "../../Government/infra/database/repository/protocol/user-repository";
import { InactivatedAccount } from "../../lib/errors/account-not-activated";
import { UserNotFoundError } from "../../lib/errors/user-not-found-error";
import { WrongPasswordError } from "../../lib/errors/wrong-password";
import { TokenProvider } from "../../lib/infra/token-provider";
import { Email } from "../../lib/model/email";
import { UserStatus } from "../../lib/model/status";

export type AuthServiceInput = {
    login: string;
    password: string;
}

export type AuthServiceOutput = Promise<
    Either<
        Error,
        {
            accessToken: string;
        }
    >
>

export interface IAuthService {
    auth({
        login,
        password,
    }: AuthServiceInput): Promise<
        Either<
            Error,
            {
                accessToken: string;
            }
        >
    >
}

export interface IAuthServiceRepository {
    getByEmail(
        email: string,
        type: string,
        status?: UserStatus
    ): Promise<UserAccountProps | null>;
    getByLogin(
        login: string,
        type: string,
        status?: UserStatus
    ): Promise<UserAccountProps | null>;
}

export class AuthService implements IAuthServiceRepository {
    constructor(
        private readonly accountRepository: UserRepositoryProtocol,
        private readonly tokenProvider: TokenProvider,
        private readonly encoder: Encoder) { }

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