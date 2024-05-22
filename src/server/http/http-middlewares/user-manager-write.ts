import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAdminMiddleware } from "../../../modules/user/factories/presentation/middlewares/admin-middleware-factory";
import { Modules } from "../../../modules/user/core/model/user-modules-access";

export const userWriteAccessAuth = adaptMiddleware(
  makeAdminMiddleware(Modules.USER, {
    write: true,
  })
);
