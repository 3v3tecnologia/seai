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

function base64Decode(text: string) {
  let buffer = Buffer.from(text, 'base64');
  return buffer.toString('ascii');
}

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

    // Decode user code to base64
    const userEmailToString = base64Decode(request.code)

    const account = await this.accountRepository.getByEmail(
      userEmailToString
    );

    if (account === null) {
      return left(new AccountNotFoundError(request.login));
    }

    console.log(account);

    if (account.status === 'registered') {
      return left(new Error("Usuário já registrado."))
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
      code: userEmailToString,
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
