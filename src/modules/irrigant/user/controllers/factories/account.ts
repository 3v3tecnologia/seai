import { ScheduleUserAccountNotification } from "../../../../../domain/use-cases/user";
import { BcryptAdapter } from "../../../../../infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "../../../../../infra/cryptography/jwt-adapter";
import { DbAccountRepository } from "../../../../../infra/database/postgres/repositories/users-repository";
import env from "../../../../../server/http/env";
import {
  JobsUseCasesFactory,
  UserUseCasesFactory,
} from "../../../../../server/http/factories";
import { IrrigantPreferencesRepository } from "../../repositories/user-preferences.repository";
import { UserIrrigantServices } from "../../services/account.service";
import { IrrigantAccountControllers } from "../account.controller";

export const makeIrrigantAccountController = (): IrrigantAccountControllers => {
  const service = new UserIrrigantServices(
    new DbAccountRepository(),
    UserUseCasesFactory.makeUserAuthentication(),
    new IrrigantPreferencesRepository(),
    new BcryptAdapter(env.hashSalt),
    new JwtAdapter(env.jwtSecret),
    new ScheduleUserAccountNotification(JobsUseCasesFactory.makeCreateJob())
  );
  return new IrrigantAccountControllers(service);
};
