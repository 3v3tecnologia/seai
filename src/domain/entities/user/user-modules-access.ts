import { Either, left, right } from "../../../shared/Either";
import {
  againstNullOrUndefinedBulk,
  checkArgumentsTypesBulk,
  concatenateMessages,
} from "../../../shared/Guard";
import { UserModulesNotFound } from "../../use-cases/user/sign-up/errors/user-email-not-found";
import { UserModuleAccessErrors } from "./errors/invalid-user-permissions";
import { UserType } from "./user";

export type SystemModulesPermissions = {
  id?: number;
  read: boolean;
  write: boolean;
};

export enum Modules {
  NEWS = "news",
  REGISTER = "register",
  USER = "user",
  JOBS = "jobs",
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

  private static hasAdminPermission(module: any) {
    return module.read === true && module.write === true;
  }

  static validate(
    modules: Required<SystemModulesProps>,
    permission_type: UserType
  ): Either<string, void> {
    const isNullOrUndefinedArgs = againstNullOrUndefinedBulk([
      { argument: modules[Modules.NEWS], argumentName: Modules.NEWS },
      { argument: modules[Modules.REGISTER], argumentName: Modules.REGISTER },
      { argument: modules[Modules.USER], argumentName: Modules.USER },
      { argument: modules[Modules.JOBS], argumentName: Modules.JOBS },
    ]);

    if (isNullOrUndefinedArgs.isLeft()) {
      return left(concatenateMessages(isNullOrUndefinedArgs.value));
    }

    const isSatisfiedTypes = checkArgumentsTypesBulk([
      {
        argument: modules[Modules.NEWS].id,
        argumentName: "identificador do acesso ao módulo de notícias",
        type: "number",
      },
      {
        argument: modules[Modules.USER].id,
        argumentName: "identificador do acesso ao módulo de usuários",
        type: "number",
      },
      {
        argument: modules[Modules.REGISTER].id,
        argumentName: "identificador do acesso ao módulo de cadastro",
        type: "number",
      },
      {
        argument: modules[Modules.NEWS].read,
        argumentName: "permissão para leitura de notícias",
        type: "boolean",
      },
      {
        argument: modules[Modules.NEWS].write,
        argumentName: "permissão para escrita de notícias",
        type: "boolean",
      },
      {
        argument: modules[Modules.USER].read,
        argumentName: "permissão para leitura de usuários",
        type: "boolean",
      },
      {
        argument: modules[Modules.USER].write,
        argumentName: "permissão para escrita de usuários",
        type: "boolean",
      },
      {
        argument: modules[Modules.REGISTER].read,
        argumentName: "permissão para leitura de registros",
        type: "boolean",
      },
      {
        argument: modules[Modules.REGISTER].write,
        argumentName: "permissão para escrita ",
        type: "boolean",
      },
      {
        argument: modules[Modules.JOBS].read,
        argumentName: "permissão para leitura de tarefas automatizadas",
        type: "boolean",
      },
      {
        argument: modules[Modules.JOBS].write,
        argumentName: "permissão para escrita para tarefas automatizadas",
        type: "boolean",
      },
    ]);

    if (isSatisfiedTypes.isLeft()) {
      return left(concatenateMessages(isSatisfiedTypes.value));
    }

    /*if (permission_type === "admin") {
      const hasAdminPermissions = [
        SystemModules.hasAdminPermission(modules[Modules.NEWS]),
        SystemModules.hasAdminPermission(modules[Modules.REGISTER]),
        SystemModules.hasAdminPermission(modules[Modules.USER]),
      ].every((permission) => permission === true);

      if (hasAdminPermissions === false) {
        return left(
          "Para usuário administrador, é necessário definir todas as permissões."
        );
      }
    }*/

    if (permission_type === "standard") {
      const hasUserManageAccess = [
        modules[Modules.USER].read,
        modules[Modules.USER].write,
      ].some((permission) => permission === true);

      if (hasUserManageAccess) {
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
    console.log("[newUserModuleAccess] :: ", newUserModuleAccess);
    console.log("[systemModules] :: ", systemModules);

    if (systemModules === undefined || systemModules?.length === 0) {
      return left(new UserModulesNotFound());
    }

    const systemModulesIds = systemModules?.map((module) => module.id);

    const alreadyRegisteredModules = new Map<string, number>();
    systemModules?.forEach((module) =>
      alreadyRegisteredModules.set(module.name, module.id)
    );

    const newUserModules = new Map(Object.entries(newUserModuleAccess));

    alreadyRegisteredModules.forEach((value, key) => {});

    const userModulesAccess = [
      newUserModuleAccess[Modules.NEWS].id,
      newUserModuleAccess[Modules.REGISTER].id,
      newUserModuleAccess[Modules.USER].id,
      newUserModuleAccess[Modules.JOBS].id,
    ];

    // evitar ter que salvar usuário com módulos que não existem
    userModulesAccess.forEach((userModuleId) => {
      const moduleNotExists =
        systemModulesIds?.some((moduleId) => moduleId === userModuleId) ===
        false;

      if (moduleNotExists) {
        return left(new UserModulesNotFound());
      }
    });

    return right(true);
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
