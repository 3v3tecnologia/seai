import { AccountRepository } from "../../../../infra/database/postgres/repositories/account-repository";
import { AdminMiddleware } from "../../../../presentation/middlewares/admin-middleware";
import { Middleware } from "../../../../presentation/middlewares/ports";

export const makeAdminMiddleware = (): Middleware => {
  const accountRepository = new AccountRepository();
  return new AdminMiddleware(accountRepository);
};
