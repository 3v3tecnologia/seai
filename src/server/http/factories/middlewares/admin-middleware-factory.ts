import { UserRepository } from "../../../../modules/User/Government/infra/database/repository/user-repository";
import { AdminMiddleware } from "../../../../presentation/middlewares/admin-middleware";
import { Middleware } from "../../../../presentation/middlewares/ports";

export const makeUserPermissionMiddleware = (
  module: string,
  access: {
    [key: string]: boolean;
  }
): Middleware => {
  const accountRepository = new UserRepository();
  return new AdminMiddleware(accountRepository, module, access);
};
