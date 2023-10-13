import { Either, left, right } from "../../../../shared/Either";
import { User, UserType } from "../../../entities/user/user";
import { Command } from "../../_ports/core/command";
import { Encoder } from "../../_ports/cryptography/encoder";
import { AccountRepositoryProtocol } from "../../_ports/repositories/account-repository";
import {
  AccountNotFoundError,
  UnmatchedPasswordError,
  WrongPasswordError,
} from "../authentication/errors";
import {
  AuthenticationDTO,
  AuthenticationService,
} from "../authentication/ports/authentication-service";
import {
  AccountEmailNotFound,
  UserModulesNotFound,
} from "./errors/user-email-not-found";
import { LoginAlreadyExists } from "./errors/user-login";
import { SignUpDTO } from "./ports/sign-up";

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
      | AccountEmailNotFound
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
      return left(new LoginAlreadyExists(user.login));
    }
    // WARN: versão final não irá ter checagem por email, mas deverá trazer o usuário do banco
    const account = await this.accountRepository.getByEmail(user.email);

    if (!account) {
      return left(new AccountEmailNotFound(user.email));
    }

    const access = await this.accountRepository.getUserModulesPermissions(
      account.id as number
    );

    if (!access) {
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
        modulesAccess: access,
        password: user.password,
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
      name: userDomain.email?.value as string,
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
