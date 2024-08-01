import { BcryptAdapter } from "../../../../../infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "../../../../../infra/cryptography/jwt-adapter";
import { PgBossAdapter } from "../../../../../infra/queueProvider/pg-boss";

import env from "../../../../../server/http/env";
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
