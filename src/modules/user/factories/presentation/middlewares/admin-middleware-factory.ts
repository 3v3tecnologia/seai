import { Middleware } from "../../../../../shared/presentation/middleware";
import { DbAccountRepository } from "../../../infra/repositories/user-repository";
import { AdminMiddleware } from "../../../presentation/middlewares/admin-middleware";

export const makeAdminMiddleware = (
  module: string,
  access: {
    [key: string]: boolean;
  }
): Middleware => {
  const accountRepository = new DbAccountRepository();
  return new AdminMiddleware(accountRepository, module, access);
};
