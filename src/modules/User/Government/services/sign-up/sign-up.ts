import { Encoder } from "../../../../../domain/use-cases/_ports/cryptography/encoder";
import { Either, left, right } from "../../../../../shared/Either";
import { UserRepositoryProtocol } from "../../infra/database/repository/protocol/user-repository";

import { User, UserType, UserTypes } from "../../../core/model/user";

import {
  AuthenticationDTO,
  AuthenticationService,
} from "../authentication/ports/authentication-service";

import { SignUpDTO } from "./ports/sign-up";
import { UserNotFoundError } from "../../../core/errors/user-not-found-error";
import {
  UnmatchedPasswordError,
  WrongPasswordError,
} from "../../../core/errors/wrong-password";
import { LoginAlreadyExists } from "../../../core/errors/login-aready-exists";
import { UserModulesNotFound } from "../../../core/errors/invalid-modules";

export class SignUp {
  private readonly accountRepository: UserRepositoryProtocol;
  private readonly encoder: Encoder;
  private readonly authentication: AuthenticationService;

  constructor(
    accountRepository: UserRepositoryProtocol,
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
      | UserNotFoundError
      | WrongPasswordError
      | LoginAlreadyExists
      | UnmatchedPasswordError
      | UserModulesNotFound,
      AuthenticationDTO.result
    >
  > {
    const existingUser = await this.accountRepository.getByLogin(user.login);

    if (!!existingUser && existingUser.type !== UserTypes.IRRIGANT) {
      return left(new LoginAlreadyExists());
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
