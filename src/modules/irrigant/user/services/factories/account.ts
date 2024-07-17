import { ScheduleUserAccountNotification } from "../../../../../domain/use-cases/user";
import { BcryptAdapter } from "../../../../../infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "../../../../../infra/cryptography/jwt-adapter";
import { DbAccountRepository } from "../../../../../infra/database/postgres/repositories/users-repository";
import env from "../../../../../server/http/env";
import {
  JobsUseCasesFactory,
  UserUseCasesFactory,
} from "../../../../../server/http/factories";
import { UserIrrigantServices } from "../account.service";
import { makeUserSettingsService } from "./user-settings";

export const makeIrrigationUserAccountService = () => {
  return new UserIrrigantServices(
    new DbAccountRepository(),
    UserUseCasesFactory.makeUserAuthentication(),
    new BcryptAdapter(env.hashSalt),
    new JwtAdapter(env.jwtSecret),
    new ScheduleUserAccountNotification(JobsUseCasesFactory.makeCreateJob()),
    makeUserSettingsService()
  );
};
