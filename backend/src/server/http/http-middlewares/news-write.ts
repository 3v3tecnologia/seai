import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAdminMiddleware } from "../factories/middlewares/admin-middleware-factory";

export const newsWriteAccessAuth = adaptMiddleware(
  makeAdminMiddleware("news_manager", {
    write: true,
  })
);
