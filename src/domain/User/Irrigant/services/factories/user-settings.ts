import env from "../../../../../server/http/env";
import { BcryptAdapter } from "../../../../../shared/infra/cryptography/bcrypt-adapter";
import { DbNewsLetterSubscriberRepository } from "../../../../Newsletter/infra/database/repository/newsletter-subscriber-repository";
import { IrrigationUserRepository } from "../../infra/repositories/irrigation-user.repository";
import { IrrigantPreferencesRepository } from "../../infra/repositories/user-preferences.repository";
import { UserSettingsServices } from "../user-settings.service";

export const makeUserSettingsService = () =>
  new UserSettingsServices(
    new IrrigantPreferencesRepository(),
    new IrrigationUserRepository(),
    new DbNewsLetterSubscriberRepository(),
    new BcryptAdapter(env.hashSalt)
  );
