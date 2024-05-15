import { Either, left, right } from "../../../shared/Either";
import { UserLogin } from "../../entities/user/login";
import { UserName } from "../../entities/user/name";
import { UserPassword } from "../../entities/user/userPassword";
import { Command } from "../_ports/core/command";
import { Encoder } from "../_ports/cryptography/encoder";
import { AccountRepositoryProtocol } from "../_ports/repositories/account-repository";
import {
  AccountNotFoundError,
  WrongPasswordError,
} from "./authentication/errors";
import { LoginAlreadyExists } from "./errors/login-aready-exists";
import {
  AccountEmailNotFound,
  UserModulesNotFound,
} from "./errors/user-account-not-found";

export class CompleteUserRegister extends Command implements ICompleteUserRegisterUseCase {
  private readonly accountRepository: AccountRepositoryProtocol;
  private readonly encoder: Encoder;

  constructor(accountRepository: AccountRepositoryProtocol, encoder: Encoder) {
    super();
    this.accountRepository = accountRepository;
    this.encoder = encoder;
  }

  async execute(
    request: CompleteUserRegisterDTO.Params
  ): Promise<
    Either<
      | AccountEmailNotFound
      | AccountNotFoundError
      | WrongPasswordError
      | LoginAlreadyExists
      | UserModulesNotFound,
      string
    >
  > {

    const alreadyExistsAccount = await this.accountRepository.getUserByCode(
      request.code
    );

    const userNotFound = alreadyExistsAccount === null;

    if (userNotFound) {
      return left(new AccountNotFoundError(request.login));
    }

    const userWithLogin = await this.accountRepository.getByLogin(
      request.login
    );

    if (userWithLogin) {
      // Se login não for do mesmo usuário então é sinal que já existe um login
      // cadastrado e o sistema deve bloquear a edição.
      const hasOtherAccountWithSameLogin =
        userWithLogin.id !== request.id && userWithLogin.login !== null;

      if (hasOtherAccountWithSameLogin) {
        return left(
          new Error(`Usuário com login ${request.login} já existe.`)
        );
      }
    }

    const userLoginOrError = UserLogin.create(request.login);
    const userNameOrError = UserName.create(request.name);

    if (userLoginOrError.isLeft()) {
      return left(userLoginOrError.value);
    }

    if (userNameOrError.isLeft()) {
      return left(userNameOrError.value);
    }

    const passwordOrError = UserPassword.create({
      value: request.password,
      confirm: request.confirmPassword,
      isHashed: false
    })

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value)
    }

    const login = userLoginOrError.value?.value as string
    const name = userNameOrError.value?.value as string
    const password = passwordOrError.value?.value as string

    const hashedPassword = await this.encoder.hash(password);

    await this.accountRepository.update({
      id: request.id,
      login: login,
      name: name,
      password: hashedPassword
    });

    this.addLog({
      action: "update",
      table: "User",
      description: `Usuário atualizado com sucesso`,
    });

    return right(`Usuário atualizado com sucesso.`);
  }
}

export namespace CompleteUserRegisterDTO {
  export type Params = {
    code: string;
    name: string;
    login: string;
    password: string;
    confirmPassword: string;
  };
  export type Result = string;
}

export interface ICompleteUserRegisterUseCase {
  execute(
    user: CompleteUserRegisterDTO.Params
  ): Promise<
    Either<
      | AccountEmailNotFound
      | AccountNotFoundError
      | WrongPasswordError
      | LoginAlreadyExists
      | UserModulesNotFound,
      string
    >
  >;
}
