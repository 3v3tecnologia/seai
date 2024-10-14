import { GovernmentUserRepository } from "../../../../domain/User/infra/repositories/gov-user-repository";
import { AdminMiddleware } from "../../../../domain/User/middlewares/admin";
import { Middleware } from "../../../../shared/middlewares/middleware";

export const makeAdminMiddleware = (): Middleware => {
  const accountRepository = new GovernmentUserRepository();
  return new AdminMiddleware(accountRepository);
};
