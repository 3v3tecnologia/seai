import { User, UserType } from "../core/model/user";
import { Command } from "../../../shared/core/command";
import { Encoder } from "../../../shared/external/cryptography/protocols/encoder";
import { LoginAlreadyExists } from "../core/errors/login-aready-exists";
import { UserModulesNotFound } from "../core/errors/module-not-found";
import { AccountNotFoundError } from "../core/errors/user-account-not-found";
import { UnmatchedPasswordError, WrongPasswordError } from "../core/errors/wrong-password";
import { AuthenticationDTO, AuthenticationService } from "./user-authentication";
import { AccountRepositoryProtocol } from "../infra/repositories/protocol/user-repository";
import { Either, left, right } from "../../../shared/core/Either";

export class SignUp extends Command {
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
    user: SignUpDTO.params
  ): Promise<
    Either<
      | AccountNotFoundError
      | WrongPasswordError
      | LoginAlreadyExists
      | UserModulesNotFound,
      AuthenticationDTO.result
    >
  > {
    const loginAlreadyExists = await this.accountRepository.getByLogin(
      user.login
    );

    if (!!loginAlreadyExists) {
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
        email: account.email as string,
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

    this.addLog({
      action: "create",
      table: "User",
      description: `Usuário ${userDomain.login?.value} registrado com sucesso`,
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

export namespace SignUpDTO {
  export type params = {
    accountId: number;
    name: string;
    login: string;
    password: string;
    confirmPassword: string;
  };
  export type result = {};
}

export interface SignInUpUseCase {
  create(user: any): Promise<Either<Error, string>>;
}
