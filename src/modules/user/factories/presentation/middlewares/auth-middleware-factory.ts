import { JwtAdapter } from "../../../../../shared/external/cryptography/jwt-adapter";
import { DbAccessKeyRepository } from "../../../../shared/db/database/postgres/repositories/access-key.repository";
import { AuthMiddleware } from "../../../../presentation/middlewares/auth-middleware";
import { Middleware } from "../../../../presentation/middlewares/ports";
import env from "../../../../../server/http/env";

export const makeAuthMiddleware = (): Middleware => {
  const token = new JwtAdapter(env.jwtSecret);
  return new AuthMiddleware(token, new DbAccessKeyRepository());
};
