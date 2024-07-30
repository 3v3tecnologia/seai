import { Encoder } from "../../../../domain/use-cases/_ports/cryptography/encoder";
import { Either, left, right } from "../../../../shared/Either";
import { UserRepositoryProtocol } from "../infra/database/repository/protocol/user-repository";
import { Email } from "../../core/model/email";
import { UserLogin } from "../../core/model/login";
import { UserName } from "../../core/model/name";
import { UserTypes } from "../../core/model/user";
import { UserPassword } from "../../core/model/userPassword";
import { LoginAlreadyExists } from "../../core/errors/login-aready-exists";
import { UserNotFoundError } from "../../core/errors/user-not-found-error";

export class UpdateUserProfile implements IUpdateUserProfileUseCase {
  private readonly accountRepository: UserRepositoryProtocol;
  private readonly encoder: Encoder;

  constructor(accountRepository: UserRepositoryProtocol, encoder: Encoder) {
    this.accountRepository = accountRepository;
    this.encoder = encoder;
  }

  async execute(
    request: UpdateUserProfileDTO.Params
  ): Promise<Either<LoginAlreadyExists, string>> {
    const userAccount = await this.accountRepository.getById(request.id);

    if (userAccount == null) {
      return left(new UserNotFoundError());
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
  export type Result = Either<UserNotFoundError | LoginAlreadyExists, string>;
}

export interface IUpdateUserProfileUseCase {
  execute(
    user: UpdateUserProfileDTO.Params
  ): Promise<UpdateUserProfileDTO.Result>;
}
