import { Either, left, right } from "../../../shared/Either";
import {
  againstNullOrUndefinedBulk,
  checkArgumentsTypesBulk,
  concatenateMessages,
} from "../../../shared/Guard";
import { UserModuleAccessErrors } from "./errors/invalid-user-permissions";

export type SystemModulesProps = {
  news_manager: {
    id?: number;
    read: boolean;
    write: boolean;
  };
  registers: {
    id?: number;
    read: boolean;
    write: boolean;
  };
  users_manager: {
    id?: number;
    read: boolean;
    write: boolean;
  };
};

type PermissionType = "admin" | "standard";
export class SystemModules {
  private modules: SystemModulesProps;

  private constructor(modules: SystemModulesProps) {
    this.modules = modules;
  }

  get value(): SystemModulesProps {
    return this.modules;
  }

  private static hasAdminPermission(module: any) {
    return module.read === true && module.write === true;
  }

  static validate(
    modules: Required<SystemModulesProps>,
    permission_type: PermissionType
  ): Either<string, void> {
    const isNullOrUndefinedArgs = againstNullOrUndefinedBulk([
      { argument: modules.news_manager, argumentName: "news_manager" },
      { argument: modules.registers, argumentName: "registers" },
      { argument: modules.users_manager, argumentName: "users_manager" },
    ]);

    if (isNullOrUndefinedArgs.isLeft()) {
      return left(concatenateMessages(isNullOrUndefinedArgs.value));
    }

    const isSatisfiedTypes = checkArgumentsTypesBulk([
      {
        argument: modules.news_manager.id,
        argumentName: "identificador do acesso ao módulo de notícias",
        type: "number",
      },
      {
        argument: modules.users_manager.id,
        argumentName: "identificador do acesso ao módulo de usuários",
        type: "number",
      },
      {
        argument: modules.registers.id,
        argumentName: "identificador do acesso ao módulo de cadastro",
        type: "number",
      },
      {
        argument: modules.news_manager.read,
        argumentName: "permissão para leitura de notícias",
        type: "boolean",
      },
      {
        argument: modules.news_manager.write,
        argumentName: "permissão para escrita de notícias",
        type: "boolean",
      },
      {
        argument: modules.users_manager.read,
        argumentName: "permissão para leitura de usuários",
        type: "boolean",
      },
      {
        argument: modules.users_manager.write,
        argumentName: "permissão para escrita de usuários",
        type: "boolean",
      },
      {
        argument: modules.registers.read,
        argumentName: "permissão para leitura de registros",
        type: "boolean",
      },
      {
        argument: modules.registers.write,
        argumentName: "permissão para escrita ",
        type: "boolean",
      },
    ]);

    if (isSatisfiedTypes.isLeft()) {
      return left(concatenateMessages(isSatisfiedTypes.value));
    }

    if (permission_type === "admin") {
      const hasAdminPermissions = [
        SystemModules.hasAdminPermission(modules.news_manager),
        SystemModules.hasAdminPermission(modules.registers),
        SystemModules.hasAdminPermission(modules.users_manager),
      ].every((permission) => permission === true);

      if (hasAdminPermissions === false) {
        return left(
          "Para usuário administrador, é necessário definir todas as permissões."
        );
      }
    }

    if (permission_type === "standard") {
      const hasUserManageAccess =
        modules.users_manager.read || modules.users_manager.write;

      if (hasUserManageAccess) {
        return left(
          "Para usuário básico, não deve haver permissão para gerenciar usuários."
        );
      }
    }

    return right();
  }

  static create(
    modules: Required<SystemModulesProps>,
    permission_type: PermissionType
  ): Either<Error, SystemModules> {
    const isValidOrError = SystemModules.validate(modules, permission_type);

    if (isValidOrError.isLeft()) {
      return left(
        new UserModuleAccessErrors.InvalidUserPermissionError(
          isValidOrError.value
        )
      );
    }

    return right(new SystemModules(modules));
  }
}
