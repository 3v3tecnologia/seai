import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAdminMiddleware } from "../factories/middlewares/admin-middleware-factory";

export const registerManagerReadAccessAuth = adaptMiddleware(
  makeAdminMiddleware("register", {
    read: true,
  })
);
