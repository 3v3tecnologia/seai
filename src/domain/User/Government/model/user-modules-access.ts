import { Either, left, right } from "../../../../shared/Either";
import {
  againstNullOrUndefinedBulk,
  concatenateMessages,
} from "../../../../shared/Guard";
import {
  UserModuleIdNotFound,
  UserModulesNotFound,
} from "../../lib/errors/invalid-modules";
import { UserModuleAccessErrors } from "../../lib/errors/invalid-user-permissions";
import { UserType } from "./user";

export type SystemModulesPermissions = {
  id?: number;
  read: boolean;
  write: boolean;
};

// System modules
export enum Modules {
  NEWSLETTER = "newsletter",
  USER = "user",
  FAQ = "faq",
  STUDIES = "studies",
  WEIGHTS = "weights",
  CROP = "crop",
  EQUIPMENTS = "equipments",
}

export type SystemModulesProps = Record<Modules, SystemModulesPermissions>;

export class SystemModules {
  private modules: SystemModulesProps;

  private constructor(modules: SystemModulesProps) {
    this.modules = modules;
  }

  get value(): SystemModulesProps {
    return this.modules;
  }

  static validate(
    modules: Required<SystemModulesProps>,
    permission_type: UserType
  ): Either<string, void> {
    const isNullOrUndefinedArgs = againstNullOrUndefinedBulk([
      { argument: modules[Modules.CROP], argumentName: Modules.CROP },
      {
        argument: modules[Modules.EQUIPMENTS],
        argumentName: Modules.EQUIPMENTS,
      },
      { argument: modules[Modules.FAQ], argumentName: Modules.FAQ },
      {
        argument: modules[Modules.NEWSLETTER],
        argumentName: Modules.NEWSLETTER,
      },
      {
        argument: modules[Modules.STUDIES],
        argumentName: Modules.STUDIES,
      },
      {
        argument: modules[Modules.WEIGHTS],
        argumentName: Modules.WEIGHTS,
      },
      {
        argument: modules[Modules.USER],
        argumentName: Modules.USER,
      },
    ]);

    if (isNullOrUndefinedArgs.isLeft()) {
      return left(concatenateMessages(isNullOrUndefinedArgs.value));
    }

    // Avoid module with true write permission  but false read permission
    for (const [moduleName, permissions] of Object.entries(modules)) {
      if (SystemModules.hasOnlyWritePermission(permissions)) {
        return left(
          `O módulo "${moduleName}" tem a propriedade "write" verdadeira, mas a propriedade "read" não é verdadeira.`
        );
      }
    }

    if (permission_type === "admin") {
      const hasAdminPermissions = [
        SystemModules.hasFullPermissions(modules[Modules.CROP]),
        SystemModules.hasFullPermissions(modules[Modules.EQUIPMENTS]),
        SystemModules.hasFullPermissions(modules[Modules.STUDIES]),
        SystemModules.hasFullPermissions(modules[Modules.WEIGHTS]),
        SystemModules.hasFullPermissions(modules[Modules.FAQ]),
        SystemModules.hasFullPermissions(modules[Modules.USER]),
        SystemModules.hasFullPermissions(modules[Modules.NEWSLETTER]),
      ].every((permission) => permission === true);

      if (hasAdminPermissions === false) {
        return left(
          "Para usuário administrador, é necessário ativar todas as permissões."
        );
      }
    }

    if (permission_type === "standard") {
      if (SystemModules.hasSomePermission(modules[Modules.USER])) {
        return left(
          "Para usuário básico, não deve haver permissão para gerenciar usuários."
        );
      }
    }

    return right();
  }

  static checkIfModuleExists(
    newUserModuleAccess: SystemModulesProps,
    systemModules: Array<{ id: number; name: string }> | null
  ): Either<UserModulesNotFound, boolean> {
    if (systemModules === undefined || systemModules?.length === 0) {
      return left(new UserModulesNotFound());
    }

    const alreadyRegisteredModules = new Map<string, number>();
    systemModules?.forEach((module) =>
      alreadyRegisteredModules.set(module.name, module.id)
    );

    const newUserModules = new Map<string, SystemModulesPermissions>();

    for (let [moduleName, modulePermissions] of Object.entries(
      newUserModuleAccess
    )) {
      newUserModules.set(moduleName, modulePermissions);
    }

    for (const [moduleName, modulePermissions] of alreadyRegisteredModules) {
      const newModule = newUserModules.get(moduleName);

      if (!newModule) {
        return left(new UserModulesNotFound(moduleName));
      }

      if (newModule.id !== modulePermissions) {
        return left(new UserModuleIdNotFound(moduleName));
      }
    }

    return right(true);
  }

  private static hasFullPermissions(module: SystemModulesPermissions) {
    return module.read === true && module.write === true;
  }

  private static hasSomePermission(module: SystemModulesPermissions) {
    return [module.read, module.write].some(
      (permission) => permission === true
    );
  }

  private static hasOnlyWritePermission(module: SystemModulesPermissions) {
    return module.read === false && module.write === true;
  }

  static create(
    modules: Required<SystemModulesProps>,
    permission_type: UserType,
    systemModules?: Array<{ id: number; name: string }>
  ): Either<Error, SystemModules> {
    if (systemModules) {
      const isExistsOrError = SystemModules.checkIfModuleExists(
        modules,
        systemModules
      );
      if (isExistsOrError.isLeft()) {
        return left(isExistsOrError.value);
      }
    }
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
