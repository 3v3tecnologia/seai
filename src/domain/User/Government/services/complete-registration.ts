import { Encoder } from "../../../../shared/ports/encoder";
import { Either, left, right } from "../../../../shared/Either";
import { base64Decode } from "../../../../shared/utils/base64Encoder";
import { UserRepositoryProtocol } from "../infra/database/repository/protocol/user-repository";
import { UserLogin } from "../../core/model/login";
import { UserName } from "../../core/model/name";
import { UserTypes } from "../../core/model/user";
import { UserPassword } from "../../core/model/userPassword";
import { UserNotFoundError } from "../../core/errors/user-not-found-error";
import { WrongPasswordError } from "../../core/errors/wrong-password";
import { LoginAlreadyExists } from "../../core/errors/login-aready-exists";
import { UserModulesNotFound } from "../../core/errors/invalid-modules";
import { UserAlreadyRegisteredError } from "../../core/errors/already-registered";

export class CompleteUserRegister implements ICompleteUserRegisterUseCase {
  private readonly accountRepository: UserRepositoryProtocol;
  private readonly encoder: Encoder;

  constructor(accountRepository: UserRepositoryProtocol, encoder: Encoder) {
    this.accountRepository = accountRepository;
    this.encoder = encoder;
  }

  async execute(
    request: CompleteUserRegisterDTO.Params
  ): Promise<
    Either<
      | UserNotFoundError
      | WrongPasswordError
      | LoginAlreadyExists
      | UserModulesNotFound,
      string
    >
  > {
    // Decode user code to base64
    const userEmailToString = base64Decode(request.code);

    const account = await this.accountRepository.getByEmail(userEmailToString, [
      UserTypes.ADMIN,
      UserTypes.STANDARD,
    ]);

    if (account === null) {
      return left(new UserNotFoundError());
    }

    if (account.status === "registered") {
      return left(new UserAlreadyRegisteredError());
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
      isHashed: false,
    });

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    const login = userLoginOrError.value?.value as string;

    const existingUser = await this.accountRepository.getByLogin(login, [
      UserTypes.ADMIN,
      UserTypes.STANDARD,
    ]);

    if (existingUser) {
      return left(new LoginAlreadyExists());
    }

    const name = userNameOrError.value?.value as string;
    const password = passwordOrError.value?.value as string;

    const hashedPassword = await this.encoder.hash(password);

    const isUpdated = await this.accountRepository.update({
      code: account.code,
      login: login,
      name: name,
      password: hashedPassword,
    });

    if (isUpdated) {
      const successMessage = `Sucesso ao completar cadastro de usuário`;

      return right(successMessage);
    }

    return left(new Error("Não foi possível completar o cadastro do usuário."));
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
      | UserNotFoundError
      | WrongPasswordError
      | LoginAlreadyExists
      | UserModulesNotFound,
      string
    >
  >;
}
