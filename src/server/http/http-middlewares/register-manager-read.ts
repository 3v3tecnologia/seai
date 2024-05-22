import { Modules } from "../../../modules/user/core/model/user-modules-access";
import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAdminMiddleware } from "../../../modules/user/factories/presentation/middlewares/admin-middleware-factory";

export const registerManagerReadAccessAuth = adaptMiddleware(
  makeAdminMiddleware(Modules.REGISTER, {
    read: true,
  })
);
