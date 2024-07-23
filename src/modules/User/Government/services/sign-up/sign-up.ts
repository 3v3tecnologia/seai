import { Encoder } from "../../../../../domain/use-cases/_ports/cryptography/encoder";
import { AccountRepositoryProtocol } from "../../infra/database/repository/protocol/user-repository";
import { Either, left, right } from "../../../../../shared/Either";
import { User, UserType, UserTypes } from "../../model/user";
import {
  AccountNotFoundError,
  UnmatchedPasswordError,
  WrongPasswordError,
} from "../authentication/errors";
import {
  AuthenticationDTO,
  AuthenticationService,
} from "../authentication/ports/authentication-service";
import { UserModulesNotFound } from "../errors/user-account-not-found";
import { AccountEmailNotFound } from "./errors/user-email-not-found";
import { LoginAlreadyExists } from "./errors/user-login";
import { SignUpDTO } from "./ports/sign-up";

export class SignUp {
  private readonly accountRepository: AccountRepositoryProtocol;
  private readonly encoder: Encoder;
  private readonly authentication: AuthenticationService;

  constructor(
    accountRepository: AccountRepositoryProtocol,
    authentication: AuthenticationService,
    encoder: Encoder
  ) {
    this.accountRepository = accountRepository;
    this.encoder = encoder;
    this.authentication = authentication;
  }
  async create(
    user: SignUpDTO.params
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
    const existingUser = await this.accountRepository.getByLogin(user.login);

    if (!!existingUser && existingUser.type !== UserTypes.IRRIGANT) {
      return left(new LoginAlreadyExists(user.login));
    }
    // WARN: versão final não irá ter checagem por email, mas deverá trazer o usuário do banco
    const account = await this.accountRepository.getUserById(user.accountId);

    if (account === null) {
      return left(new Error(`Usuário não encontrado.`));
    }

    if (!account.modules) {
      return left(new UserModulesNotFound());
    }

    if (user.password !== user.confirmPassword) {
      return left(new UnmatchedPasswordError());
    }

    const userOrError = User.create(
      {
        email: account.email,
        type: account.type as UserType,
        login: user.login,
        name: user.name,
        modulesAccess: account.modules,
        password: user.password,
        confirmPassword: user.confirmPassword,
      },
      account.id
    );

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const userDomain = userOrError.value as User;

    const hashedPassword = await this.encoder.hash(user.password);

    // TODO: deve passar todos os campos do 'account'
    await this.accountRepository.update({
      id: userDomain.id as number,
      email: userDomain.email?.value as string,
      login: userDomain.login?.value as string,
      name: userDomain.name?.value as string,
      password: hashedPassword,
    });

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
