import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAuthMiddleware } from "../../../modules/user/factories/presentation/middlewares/auth-middleware-factory";

export const authorization = adaptMiddleware(makeAuthMiddleware());
