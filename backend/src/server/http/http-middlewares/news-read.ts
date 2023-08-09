import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAdminMiddleware } from "../factories/middlewares/admin-middleware-factory";

export const newsReadAccessAuth = adaptMiddleware(
  makeAdminMiddleware("news_manager", {
    read: true,
  })
);
