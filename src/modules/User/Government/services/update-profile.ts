import { Encoder } from "../../../../domain/use-cases/_ports/cryptography/encoder";
import { AccountRepositoryProtocol } from "../infra/database/repository/protocol/user-repository";
import { Either, left, right } from "../../../../shared/Either";
import { Email } from "../model/email";
import { UserLogin } from "../model/login";
import { UserName } from "../model/name";
import { UserTypes } from "../model/user";
import { UserPassword } from "../model/userPassword";
import { LoginAlreadyExists } from "./errors/login-aready-exists";
import {
  AccountEmailNotFound,
  AccountNotFoundError,
} from "./errors/user-account-not-found";

export class UpdateUserProfile implements IUpdateUserProfileUseCase {
  private readonly accountRepository: AccountRepositoryProtocol;
  private readonly encoder: Encoder;

  constructor(accountRepository: AccountRepositoryProtocol, encoder: Encoder) {
    this.accountRepository = accountRepository;
    this.encoder = encoder;
  }

  async execute(
    request: UpdateUserProfileDTO.Params
  ): Promise<
    Either<
      AccountEmailNotFound | AccountNotFoundError | LoginAlreadyExists,
      string
    >
  > {
    const userAccount = await this.accountRepository.getById(request.id);

    if (userAccount == null) {
      return left(new AccountNotFoundError());
    }

    if (userAccount.type === "pending") {
      return left(new Error("Necessário confirmar a conta"));
    }

    const userLoginOrError = UserLogin.create(request.login);
    const userNameOrError = UserName.create(request.name);

    if (userLoginOrError.isLeft()) {
      return left(userLoginOrError.value);
    }

    if (userNameOrError.isLeft()) {
      return left(userNameOrError.value);
    }

    const userLogin = userLoginOrError.value?.value as string;
    const userName = userNameOrError.value?.value as string;

    const toUpdate = {
      id: request.id,
      login: userLogin || null,
      name: userName || null,
    };

    if (Reflect.has(request, "password")) {
      const passwordOrError = UserPassword.create({
        value: request.password as string,
        confirm: request.confirmPassword,
        isHashed: false,
      });

      if (passwordOrError.isLeft()) {
        return left(passwordOrError.value);
      }

      const password = passwordOrError.value?.value as string;
      const hashedPassword = await this.encoder.hash(password);

      Object.assign(toUpdate, {
        password: hashedPassword,
      });
    }

    // Usuário admin pode editar usuário mesmo não havendo login ain

    if (request.email) {
      const existingAccount = await this.accountRepository.getByEmail(
        request.email,
        [UserTypes.ADMIN, UserTypes.STANDARD]
      );

      if (existingAccount) {
        if (existingAccount.id !== request.id) {
          return left(
            new Error(`Usuário com email ${request.email} já existe.`)
          );
        }
      }

      const userEmailOrError = Email.create(request.email);

      if (userEmailOrError.isLeft()) {
        return left(userEmailOrError.value);
      }

      const userEmail = userEmailOrError.value?.value;

      Object.assign(toUpdate, {
        email: userEmail || null,
      });
    }

    await this.accountRepository.update(toUpdate);

    return right(`Usuário atualizado com sucesso.`);
  }
}

export namespace UpdateUserProfileDTO {
  export type Params = {
    id: number;
    email?: string;
    login: string;
    name: string;
    password?: string;
    confirmPassword?: string;
  };
  export type Result = Either<
    AccountEmailNotFound | AccountNotFoundError | LoginAlreadyExists,
    string
  >;
}

export interface IUpdateUserProfileUseCase {
  execute(
    user: UpdateUserProfileDTO.Params
  ): Promise<UpdateUserProfileDTO.Result>;
}
