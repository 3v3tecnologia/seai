import { GovernmentUserRepository } from "../../../../domain/User/infra/repositories/gov-user-repository";
import { ModuleAccessPermissionMiddleware } from "../../../../domain/User/middlewares/module-access";
import { Middleware } from "../../../../shared/middlewares/middleware";

export const makeUserPermissionMiddleware = (
  module: string,
  access: {
    [key: string]: boolean;
  }
): Middleware => {
  return new ModuleAccessPermissionMiddleware(
    new GovernmentUserRepository(),
    module,
    access
  );
};
