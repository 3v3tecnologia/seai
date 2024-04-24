import { Either, left, right } from "../../../../shared/Either";
import { User, UserTypes } from "../../../entities/user/user";
import { SystemModules } from "../../../entities/user/user-modules-access";
import { Command } from "../../_ports/core/command";
import { Encoder } from "../../_ports/cryptography/encoder";
import { AccountRepositoryProtocol } from "../../_ports/repositories/account-repository";
import {
  AccountNotFoundError,
  WrongPasswordError,
} from "../authentication/errors";
import {
  AccountEmailNotFound,
  UserModulesNotFound,
} from "./errors/user-account-not-found";
import { LoginAlreadyExists } from "./errors/login-aready-exists";
import { UpdateUserDTO } from "./ports/update-user";

export class UpdateUser extends Command {
  private readonly accountRepository: AccountRepositoryProtocol;
  private readonly encoder: Encoder;

  constructor(accountRepository: AccountRepositoryProtocol, encoder: Encoder) {
    super();
    this.accountRepository = accountRepository;
    this.encoder = encoder;
  }

  async execute(
    request: UpdateUserDTO.params
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
    console.log(request);
    const alreadyExistsAccount = await this.accountRepository.getById(
      request.id
    );

    const userNotFound = alreadyExistsAccount === null;

    if (userNotFound) {
      return left(new AccountNotFoundError(request.email));
    }

    // Usuário admin pode editar usuário mesmo não havendo login ain

    if (request.login !== null) {
      const userWithLogin = await this.accountRepository.getByLogin(
        request.login
      );

      /*if (userWithLogin) {
        // Se login não for do mesmo usuário então é sinal que já existe um login
        // cadastrado e o sistema deve bloquear a edição.
        const hasOtherAccountWithSameLogin =
          userWithLogin.id !== request.id && userWithLogin.login !== null;

        if (hasOtherAccountWithSameLogin) {
          return left(
            new Error(`Usuário com login ${request.login} já existe.`)
          );
        }
      }*/
    }

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
