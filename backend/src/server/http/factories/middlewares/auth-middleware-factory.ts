import { AuthMiddleware } from "../../../../presentation/middlewares/auth-middleware";
import { Middleware } from "../../../../presentation/middlewares/ports";
import { makeFetchAccountByToken } from "../use-cases/user/fetch-user-account-usecase-factory";

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeFetchAccountByToken(), role);
};
