import env from "../../../../../server/http/env";
import { BcryptAdapter } from "../../../../../shared/infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "../../../../../shared/infra/cryptography/jwt-adapter";
import { PgBossAdapter } from "../../../../../shared/infra/queueProvider/pg-boss";
import { IrrigationUserRepository } from "../../infra/repositories/irrigation-user.repository";
import { IrrigationUserService } from "../irrigation-user.service";

import { makeUserSettingsService } from "./user-settings";

export const makeIrrigationUserAccountService = () => {
  return new IrrigationUserService(
    new IrrigationUserRepository(),
    new BcryptAdapter(env.hashSalt),
    new JwtAdapter(env.jwtSecret),
    new PgBossAdapter(),
    makeUserSettingsService()
  );
};
