import { newsletterService } from "../../../../Newsletter/services";
import { IrrigationUserRepository } from "../../infra/repositories/irrigation-user.repository";
import { IrrigantPreferencesRepository } from "../../infra/repositories/user-preferences.repository";
import { UserSettingsServices } from "../user-settings.service";

export const makeUserSettingsService = () =>
  new UserSettingsServices(
    new IrrigantPreferencesRepository(),
    new IrrigationUserRepository(),
    newsletterService
  );
