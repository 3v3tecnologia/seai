import { KnexAccountRepository } from "../../../../infra/database/postgres/repositories/account-repository";
import { AdminMiddleware } from "../../../../presentation/middlewares/admin-middleware";
import { Middleware } from "../../../../presentation/middlewares/ports";

export const makeAdminMiddleware = (
  module: string,
  access: {
    [key: string]: boolean;
  }
): Middleware => {
  const accountRepository = new KnexAccountRepository();
  return new AdminMiddleware(accountRepository, module, access);
};
