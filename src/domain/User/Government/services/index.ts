import env from "../../../../server/http/env";
import { BcryptAdapter } from "../../../../shared/infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "../../../../shared/infra/cryptography/jwt-adapter";
import { PgBossAdapter } from "../../../../shared/infra/queueProvider/pg-boss";
import { UserRepository } from "../infra/database/repository/user-repository";
import { GovernmentUserService } from "./user.service";

export const makeGovernmentUserService = () => {
  return new GovernmentUserService(
    new UserRepository(),
    new BcryptAdapter(env.hashSalt),
    new JwtAdapter(env.jwtSecret),
    new PgBossAdapter()
  );
};
