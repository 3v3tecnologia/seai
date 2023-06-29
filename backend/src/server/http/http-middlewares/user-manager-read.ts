import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAdminMiddleware } from "../factories/middlewares/admin-middleware-factory";

export const userReadAccessAuth = adaptMiddleware(
  makeAdminMiddleware("user", {
    read: true,
  })
);
