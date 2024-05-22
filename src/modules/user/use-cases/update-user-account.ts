import { User, UserType } from "../core/model/user";
import {
  SystemModules,
  SystemModulesProps,
} from "../core/model/user-modules-access";
import { Command } from "../../../shared/core/command";
import { Encoder } from "../../../shared/external/cryptography/protocols/encoder";
import { LoginAlreadyExists } from "../core/errors/login-aready-exists";
import { UserModulesNotFound } from "../core/errors/module-not-found";
import {
  AccountNotFoundError,
} from "../core/errors/user-account-not-found";
import { WrongPasswordError } from "../core/errors/wrong-password";
import { AccountRepositoryProtocol } from "../infra/repositories/protocol/user-repository";
import { Either, left, right } from "../../../shared/core/Either";

export class UpdateUser extends Command implements IUpdateUserUseCase {
  private readonly accountRepository: AccountRepositoryProtocol;
  private readonly encoder: Encoder;

  constructor(accountRepository: AccountRepositoryProtocol, encoder: Encoder) {
    super();
    this.accountRepository = accountRepository;
    this.encoder = encoder;
  }

  async execute(
    request: UpdateUserDTO.Params
  ): Promise<
    Either<
      | AccountNotFoundError
      | WrongPasswordError
      | LoginAlreadyExists
      | UserModulesNotFound,
      string
    >
  > {
    const alreadyExistsAccount = await this.accountRepository.getById(
      request.id
    );

    const userNotFound = alreadyExistsAccount === null;

    if (userNotFound) {
      return left(new AccountNotFoundError());
    }

    // Usuário admin pode editar usuário mesmo não havendo login ain

    if (request.email !== null) {
      const userWithSameEmail = await this.accountRepository.getByEmail(
        request.email
      );

      if (userWithSameEmail) {
        const hasOtherAccountWithSameEmail =
          userWithSameEmail.id !== request.id;

        if (hasOtherAccountWithSameEmail) {
          return left(
            new Error(`Usuário com email ${request.email} já existe.`)
          );
        }
      }
    }

    const modules = await this.accountRepository.getModules();

    const userPermissionType = request.type;

    const createUserDTO = {
      email: request.email,
      type: userPermissionType,
      login: request.login,
      name: request.name,
      modulesAccess: null,
    };

    if (request.modules) {
      const hasValidModulesOrError = SystemModules.checkIfModuleExists(
        request.modules,
        modules
      );

      if (hasValidModulesOrError.isLeft()) {
        return left(hasValidModulesOrError.value);
      }

      Object.assign(createUserDTO, {
        modulesAccess: request.modules,
      });
    }

    // TODO: add validation in controller
    if (Reflect.has(request, "password") && request.password !== null) {
      Object.assign(createUserDTO, {
        password: request.password,
        confirmPassword: request.confirmPassword,
      });
    }

    const userAccountOrError = User.create(createUserDTO, request.id);

    if (userAccountOrError.isLeft()) {
      return left(userAccountOrError.value);
    }

    const user = userAccountOrError.value as User;

    const userToPersistency = {
      id: user.id as number,
      email: user.email ? (user.email.value as string) : null,
      login: user.login ? (user.login.value as string) : null,
      type: user.type ? (user.type as string) : null,
      name: user.name ? (user.name.value as string) : null,
      modules: user.access ? user.access.value : null,
    };

    if (user.password) {
      const hashedPassword = await this.encoder.hash(user.password.value);

      Object.assign(userToPersistency, {
        password: hashedPassword,
      });
    }
    // TODO: deve passar todos os campos do 'account'
    await this.accountRepository.update(userToPersistency);

    this.addLog({
      action: "update",
      table: "User",
      description: `Usuário atualizado com sucesso`,
    });

    return right(`Usuário atualizado com sucesso.`);
  }
}

export namespace UpdateUserDTO {
  export type Params = {
    id: number;
    email: string;
    type: UserType;
    name: string | null;
    login: string | null;
    password?: string | null;
    confirmPassword?: string | null;
    modules?: SystemModulesProps;
  };
  export type Result = string;
}

export interface IUpdateUserUseCase {
  execute(
    user: UpdateUserDTO.Params
  ): Promise<
    Either<
      | AccountNotFoundError
      | WrongPasswordError
      | LoginAlreadyExists
      | UserModulesNotFound,
      string
    >
  >;
}
