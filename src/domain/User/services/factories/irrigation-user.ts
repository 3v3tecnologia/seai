import env from "../../../../server/http/env";
import { BcryptAdapter } from "../../../../shared/infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "../../../../shared/infra/cryptography/jwt-adapter";
import { PgBossAdapter } from "../../../../shared/infra/queueProvider/pg-boss";
import { IrrigationUserRepository } from "../../infra/repositories/irrigation-user.repository";
import { AuthService } from "../authentication.service";
import { IrrigationUserService } from "../irrigant-user.service";
import { irrigantSettingsService } from "./irrigation-settings";

const irrigantRepository = new IrrigationUserRepository()

export const irrigantUserAccountService = new IrrigationUserService(
  irrigantRepository,
  new BcryptAdapter(env.hashSalt),
  new PgBossAdapter(),
  irrigantSettingsService,
  new AuthService(
    irrigantRepository,
    new JwtAdapter(env.jwtSecret),
    new BcryptAdapter(env.hashSalt),
  )
);
