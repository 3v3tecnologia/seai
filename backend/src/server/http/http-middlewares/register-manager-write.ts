import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAdminMiddleware } from "../factories/middlewares/admin-middleware-factory";

export const registerManagerWriteAccessAuth = adaptMiddleware(
  makeAdminMiddleware("register", {
    write: true,
  })
);
