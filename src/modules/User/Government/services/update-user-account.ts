import { Encoder } from "../../../../domain/use-cases/_ports/cryptography/encoder";
import { Either, left, right } from "../../../../shared/Either";
import { UserCommandOperationProps } from "../../../UserOperations/protocols/logger";
import { LoginAlreadyExists } from "../../core/errors/login-aready-exists";
import { UserNotFoundError } from "../../core/errors/user-not-found-error";
import { WrongPasswordError } from "../../core/errors/wrong-password";
import { User, UserType, UserTypes } from "../../core/model/user";
import {
  SystemModules,
  SystemModulesProps,
} from "../../core/model/user-modules-access";
import { UserRepositoryProtocol } from "../infra/database/repository/protocol/user-repository";

export class UpdateUser implements IUpdateUserUseCase {
  constructor(
    private readonly accountRepository: UserRepositoryProtocol,
    private readonly encoder: Encoder
  ) {}

  async execute(
    request: {
      id: number;
      email: string;
      type: UserType;
      name: string | null;
      login: string | null;
      password?: string | null;
      confirmPassword?: string | null;
      modules?: SystemModulesProps;
    },
    operation: UserCommandOperationProps
  ): Promise<
    Either<UserNotFoundError | WrongPasswordError | LoginAlreadyExists, string>
  > {
    const existingAccount = await this.accountRepository.getById(request.id);

    if (existingAccount === null) {
      return left(new UserNotFoundError());
    }

    if (existingAccount.type === "admin" && request.type !== "admin") {
      return left(
        new Error("Não é possível alterar o tipo de um usuário administrador")
      );
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
    await this.accountRepository.update(userToPersistency, operation);

    return right(`Usuário atualizado com sucesso.`);
  }
}

export interface IUpdateUserUseCase {
  execute(
    user: {
      id: number;
      email: string;
      type: UserType;
      name: string | null;
      login: string | null;
      password?: string | null;
      confirmPassword?: string | null;
      modules?: SystemModulesProps;
    },
    operation: UserCommandOperationProps
  ): Promise<
    Either<UserNotFoundError | WrongPasswordError | LoginAlreadyExists, string>
  >;
}
