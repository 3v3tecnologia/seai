import { Either, left, right } from "../../../shared/Either";
import {
  againstNullOrUndefinedBulk,
  checkArgumentsTypesBulk,
  concatenateMessages,
} from "../../../shared/Guard";

export type UserModulesAccessProps = {
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

export class UserModulesAccess {
  private modules: UserModulesAccessProps;

  private constructor(modules: UserModulesAccessProps) {
    this.modules = modules;
  }

  get value(): UserModulesAccessProps {
    return this.modules;
  }

  static create(
    modules: UserModulesAccessProps
  ): Either<Error, UserModulesAccess> {
    const isValid = validateUserModules(modules);

    if (isValid.isLeft()) {
      return left(isValid.value);
    }

    return right(new UserModulesAccess(modules));
  }
}

function validateUserModules(
  modules: UserModulesAccessProps
): Either<Error, void> {
  const isNullOrUndefinedArgs = againstNullOrUndefinedBulk([
    { argument: modules.news_manager, argumentName: "news_manager" },
    { argument: modules.registers, argumentName: "registers" },
    { argument: modules.users_manager, argumentName: "users_manager" },
  ]);

  if (isNullOrUndefinedArgs.isLeft()) {
    return left(new Error(concatenateMessages(isNullOrUndefinedArgs.value)));
  }

  const isSatisfiedTypes = checkArgumentsTypesBulk([
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
    return left(new Error(concatenateMessages(isSatisfiedTypes.value)));
  }

  return right();
}
