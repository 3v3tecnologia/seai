import { UserRepository } from "../../../../domain/User/Government/infra/database/repository/user-repository";
import { AdminMiddleware } from "../../../../domain/User/Government/middlewares/admin";
import { Middleware } from "../../../../shared/middlewares/middleware";

export const makeAdminMiddleware = (): Middleware => {
  const accountRepository = new UserRepository();
  return new AdminMiddleware(accountRepository);
};
