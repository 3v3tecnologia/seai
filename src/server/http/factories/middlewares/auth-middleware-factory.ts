import { JwtAdapter } from "../../../../shared/infra/cryptography/jwt-adapter";
import { AuthMiddleware } from "../../../../shared/middlewares/auth-middleware";
import { Middleware } from "../../../../shared/middlewares/middleware";
import env from "../../env";

export const makeAuthMiddleware = (): Middleware => {
  const token = new JwtAdapter(env.jwtSecret);
  return new AuthMiddleware(token);
};
