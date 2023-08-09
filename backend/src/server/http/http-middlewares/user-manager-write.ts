import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAdminMiddleware } from "../factories/middlewares/admin-middleware-factory";

export const userWriteAccessAuth = adaptMiddleware(
  makeAdminMiddleware("users_manager", {
    write: true,
  })
);
