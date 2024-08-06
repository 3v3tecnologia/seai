import env from "../../../../../server/http/env";
import { BcryptAdapter } from "../../../../../shared/infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "../../../../../shared/infra/cryptography/jwt-adapter";
import { PgBossAdapter } from "../../../../../shared/infra/queueProvider/pg-boss";
import { UserRepository } from "../../../Government/infra/database/repository/user-repository";

import { UserIrrigantServices } from "../account.service";
import { makeUserSettingsService } from "./user-settings";

export const makeIrrigationUserAccountService = () => {
  return new UserIrrigantServices(
    new UserRepository(),
    new BcryptAdapter(env.hashSalt),
    new JwtAdapter(env.jwtSecret),
    new PgBossAdapter(),
    makeUserSettingsService()
  );
};
