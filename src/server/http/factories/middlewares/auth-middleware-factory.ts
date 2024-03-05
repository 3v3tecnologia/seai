import { JwtAdapter } from "../../../../infra/cryptography/jwt-adapter";
import { DbAccessKeyRepository } from "../../../../infra/database/postgres/repositories/access-key.repository";
import { AuthMiddleware } from "../../../../presentation/middlewares/auth-middleware";
import { Middleware } from "../../../../presentation/middlewares/ports";
import env from "../../env";

export const makeAuthMiddleware = (): Middleware => {
  const token = new JwtAdapter(env.jwtSecret);
  return new AuthMiddleware(token, new DbAccessKeyRepository());
};
