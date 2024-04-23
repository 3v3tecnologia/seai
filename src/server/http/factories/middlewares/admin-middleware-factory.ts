import { DbAccountRepository } from "../../../../infra/database/postgres/repositories/users-repository";
import { AdminMiddleware } from "../../../../presentation/middlewares/admin-middleware";
import { Middleware } from "../../../../presentation/middlewares/ports";

export const makeAdminMiddleware = (
  module: string,
  access: {
    [key: string]: boolean;
  }
): Middleware => {
  const accountRepository = new DbAccountRepository();
  return new AdminMiddleware(accountRepository, module, access);
};
