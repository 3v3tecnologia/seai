import { BcryptAdapter } from "../../../../../infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "../../../../../infra/cryptography/jwt-adapter";
import { DbAccountRepository } from "../../../../../infra/database/postgres/repositories/users-repository";
import env from "../../../../../server/http/env";
import { UserUseCasesFactory } from "../../../../../server/http/factories";
import { IrrigantPreferencesRepository } from "../../repositories/user-preferences.repository";
import { UserIrrigantServices } from "../../services/account";
import { IrrigantAccountControllers } from "../account.controller";

export const makeIrrigantAccountController = (): IrrigantAccountControllers => {
  return new IrrigantAccountControllers(
    new UserIrrigantServices(
      new DbAccountRepository(),
      UserUseCasesFactory.makeUserAuthentication(),
      new IrrigantPreferencesRepository(),
      new BcryptAdapter(env.hashSalt),
      new JwtAdapter(env.jwtSecret)
    )
  );
};
