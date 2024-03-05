import { Modules } from "../../../domain/entities/user/user-modules-access";
import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAdminMiddleware } from "../factories/middlewares/admin-middleware-factory";

export const userReadAccessAuth = adaptMiddleware(
  makeAdminMiddleware(Modules.USER, {
    read: true,
  })
);
