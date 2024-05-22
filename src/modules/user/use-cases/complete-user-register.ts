

import { base64Decode } from "../../../shared/core/base64Encoder";
import { UserLogin } from "../core/model/login";
import { UserName } from "../core/model/name";
import { UserPassword } from "../core/model/userPassword";
import { Command } from "../../../shared/core/command";
import { Encoder } from "../../../shared/external/cryptography/protocols/encoder";
import { LoginAlreadyExists } from "../core/errors/login-aready-exists";
import {
  AccountNotFoundError,
} from "../core/errors/user-account-not-found";
import { WrongPasswordError } from "../core/errors/wrong-password";
import { AccountRepositoryProtocol } from "../infra/repositories/protocol/user-repository";
import { Either, left, right } from "../../../shared/core/Either";
import { UserAlreadyExistsError } from '../core/errors/user-already-exists';



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
      | AccountNotFoundError
      | WrongPasswordError
      | LoginAlreadyExists,
      string
    >
  > {

    // Decode user code to base64
    const userEmailToString = base64Decode(request.code)

    const account = await this.accountRepository.getByEmail(
      userEmailToString
    );

    if (account === null) {
      return left(new AccountNotFoundError());
    }

    if (account.status === 'registered') {
      return left(new UserAlreadyExistsError())
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

    const hasDuplicatedLogin = await this.accountRepository.checkIfLoginAlreadyExists(login)

    if (hasDuplicatedLogin) {
      return left(new LoginAlreadyExists())
    }

    const name = userNameOrError.value?.value as string
    const password = passwordOrError.value?.value as string

    const hashedPassword = await this.encoder.hash(password);

    const isUpdated = await this.accountRepository.update({
      code: account.code,
      login: login,
      name: name,
      password: hashedPassword
    });

    if (isUpdated) {
      const successMessage = `Sucesso ao completar cadastro de usuário`
      this.addLog({
        action: "update",
        table: "User",
        description: successMessage,
      });

      return right(successMessage);
    }

    return left(new Error("Não foi possível completar o cadastro do usuário."))
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
      | AccountNotFoundError
      | WrongPasswordError
      | LoginAlreadyExists,
      string
    >
  >;
}
