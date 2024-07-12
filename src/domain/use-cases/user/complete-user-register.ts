import { Either, left, right } from "../../../shared/Either";
import { base64Decode } from "../../../shared/utils/base64Encoder";
import { UserLogin } from "../../entities/user/login";
import { UserName } from "../../entities/user/name";
import { UserTypes } from "../../entities/user/user";
import { UserPassword } from "../../entities/user/userPassword";
import { Command } from "../_ports/core/command";
import { Encoder } from "../_ports/cryptography/encoder";
import { AccountRepositoryProtocol } from "../_ports/repositories/account-repository";
import { NotExistsError } from "../errors/notFound-error";
import { UserAlreadyExistsError } from "../errors/user-already-exists";
import { UserAlreadyRegisteredError } from "../errors/user-already-registered";
import { UserNotFoundError } from "../errors/user-not-found";
import {
  AccountNotFoundError,
  WrongPasswordError,
} from "./authentication/errors";
import { LoginAlreadyExists } from "./errors/login-aready-exists";
import {
  AccountEmailNotFound,
  UserModulesNotFound,
} from "./errors/user-account-not-found";

export class CompleteUserRegister
  extends Command
  implements ICompleteUserRegisterUseCase
{
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
    const userEmailToString = base64Decode(request.code);

    const account = await this.accountRepository.getByEmail(userEmailToString);

    if (account === null || account.type === UserTypes.IRRIGANT) {
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

    const existingUser = await this.accountRepository.getByLogin(login);

    if (existingUser && existingUser.type !== UserTypes.IRRIGANT) {
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
      this.addLog({
        action: "update",
        table: "User",
        description: successMessage,
      });

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
      | AccountEmailNotFound
      | AccountNotFoundError
      | WrongPasswordError
      | LoginAlreadyExists
      | UserModulesNotFound,
      string
    >
  >;
}
