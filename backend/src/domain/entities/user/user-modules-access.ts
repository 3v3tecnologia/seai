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

export class SystemModules {
  private modules: SystemModulesProps;

  private constructor(modules: SystemModulesProps) {
    this.modules = modules;
  }

  get value(): SystemModulesProps {
    return this.modules;
  }

  static validate(modules: Required<SystemModulesProps>): Either<string, void> {
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

    return right();
  }

  static create(
    modules: Required<SystemModulesProps>
  ): Either<Error, SystemModules> {
    const isValidOrError = SystemModules.validate(modules);

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
