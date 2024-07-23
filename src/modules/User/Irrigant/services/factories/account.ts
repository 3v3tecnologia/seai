import { BcryptAdapter } from "../../../../../infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "../../../../../infra/cryptography/jwt-adapter";

import env from "../../../../../server/http/env";
import { JobsUseCasesFactory } from "../../../../../server/http/factories";
import { UserRepository } from "../../../Government/infra/database/repository/user-repository";
import { ScheduleUserAccountNotification } from "../../../Government/services";
import { UserUseCasesFactory } from "../../../Government/services/factory/user.useCase.factory";

import { UserIrrigantServices } from "../account.service";
import { makeUserSettingsService } from "./user-settings";

export const makeIrrigationUserAccountService = () => {
  return new UserIrrigantServices(
    new UserRepository(),
    UserUseCasesFactory.makeUserAuthentication(),
    new BcryptAdapter(env.hashSalt),
    new JwtAdapter(env.jwtSecret),
    new ScheduleUserAccountNotification(JobsUseCasesFactory.makeCreateJob()),
    makeUserSettingsService()
  );
};
