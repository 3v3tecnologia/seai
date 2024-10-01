import env from "../../../../server/http/env";
import { BcryptAdapter } from "../../../../shared/infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "../../../../shared/infra/cryptography/jwt-adapter";
import { PgBossAdapter } from "../../../../shared/infra/queueProvider/pg-boss";
import { GovernmentUserRepository } from "../../infra/repositories/gov-user-repository";
import { AuthService } from "../authentication.service";
import { GovernmentUserService } from "../gov-user.service";


const govUserRepository = new GovernmentUserRepository()

export const govUserService = new GovernmentUserService(
  govUserRepository,
  new BcryptAdapter(env.hashSalt),
  new PgBossAdapter(),
  new AuthService(
    govUserRepository,
    new JwtAdapter(env.jwtSecret),
    new BcryptAdapter(env.hashSalt),
  )
);
