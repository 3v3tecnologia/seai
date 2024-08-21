import { UserRepository } from "../../../../domain/User/Government/infra/database/repository/user-repository";
import { ModuleAccessPermissionMiddleware } from "../../../../domain/User/Government/middlewares/module-access";
import { Middleware } from "../../../../shared/middlewares/middleware";

export const makeUserPermissionMiddleware = (
  module: string,
  access: {
    [key: string]: boolean;
  }
): Middleware => {
  const accountRepository = new UserRepository();
  return new ModuleAccessPermissionMiddleware(
    accountRepository,
    module,
    access
  );
};
