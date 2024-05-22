
import env from "../../../../../server/http/env";
import { JwtAdapter } from "../../../../../shared/external/cryptography/jwt-adapter";
import { DbAccessKeyRepository } from "../../../../../shared/external/db/postgres/repositories/access-key.repository";
import { Middleware } from "../../../../../shared/presentation/middleware";
import { AuthMiddleware } from "../../../presentation/middlewares/auth-middleware";

export const makeAuthMiddleware = (): Middleware => {
  const token = new JwtAdapter(env.jwtSecret);
  return new AuthMiddleware(token, new DbAccessKeyRepository());
};
