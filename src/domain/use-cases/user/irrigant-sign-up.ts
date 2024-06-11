import { UserTypes } from './../../entities/user/user';
import { Either, left, right } from "../../../shared/Either";
import { User, } from "../../entities/user/user";
import { Command } from "../_ports/core/command";
import { Encoder } from "../_ports/cryptography/encoder";
import { AccountRepositoryProtocol } from "../_ports/repositories/account-repository";
import { UnmatchedPasswordError, WrongPasswordError } from "./authentication/errors";
import { AuthenticationDTO, AuthenticationService } from "./authentication/ports/authentication-service";
import { LoginAlreadyExists } from "./errors/login-aready-exists";
import { AccountEmailNotFound, AccountNotFoundError, UserModulesNotFound } from "./errors/user-account-not-found";
import { Logger } from '../../../shared/logger/logger';

export class IrrigantSignUp extends Command {
    private readonly accountRepository: AccountRepositoryProtocol;
    private readonly encoder: Encoder;
    private readonly authentication: AuthenticationService;

    constructor(
        accountRepository: AccountRepositoryProtocol,
        authentication: AuthenticationService,
        encoder: Encoder
    ) {
        super();
        this.accountRepository = accountRepository;
        this.encoder = encoder;
        this.authentication = authentication;
    }
    async create(
        user: IrrigantSignUpDTO.params
    ): Promise<
        Either<
            | AccountEmailNotFound
            | AccountNotFoundError
            | WrongPasswordError
            | LoginAlreadyExists
            | UserModulesNotFound,
            AuthenticationDTO.result
        >
    > {
        const emailAlreadyExists = await this.accountRepository.getByEmail(
            user.email
        );

        if (!!emailAlreadyExists) {
            return left(new Error("Email já existe"));
        }


        if (user.password !== user.confirmPassword) {
            return left(new UnmatchedPasswordError());
        }

        const userOrError = User.create(
            {
                email: user.email,
                type: UserTypes.IRRIGANT,
                login: user.login,
                name: user.name,
                password: user.password,
                confirmPassword: user.confirmPassword,
            }
        );

        if (userOrError.isLeft()) {
            return left(userOrError.value);
        }


        const userHash = await this.encoder.hashInPbkdf2(user.email, 100, 10, 'sha512')

        const hashedPassword = await this.encoder.hash(user.password);

        // TODO: deve passar todos os campos do 'account'
        const user_id = await this.accountRepository.add({
            email: user.email,
            login: user.login,
            name: user.name,
            type: UserTypes.IRRIGANT,
            code: userHash as string,
            status: 'registered',
            password: hashedPassword,
        });

        Logger.info(`Usuário ${user_id} criado com sucesso`)

        const tokenOrError = await this.authentication.auth({
            login: user.login,
            password: user.password,
        });

        if (tokenOrError.isLeft()) {
            return left(tokenOrError.value);
        }

        return right(tokenOrError.value);
    }
}

export namespace IrrigantSignUpDTO {
    export type params = {
        login: string;
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
    };
    export type result = {};
}

export interface IrrigantSignUpUseCase {
    create(user: any): Promise<Either<Error, string>>;
}