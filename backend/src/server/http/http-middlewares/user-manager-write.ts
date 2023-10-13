import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAdminMiddleware } from "../factories/middlewares/admin-middleware-factory";
import { Modules } from "../../../domain/entities/user/user-modules-access";

export const userWriteAccessAuth = adaptMiddleware(
  makeAdminMiddleware(Modules.USER, {
    write: true,
  })
);
