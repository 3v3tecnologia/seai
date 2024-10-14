import { newsletterService } from "../../../Newsletter/services";
import { IrrigationUserRepository } from "../../infra/repositories/irrigation-user.repository";
import { IrrigantPreferencesRepository } from "../../infra/repositories/irrigation-settings.repository";
import { UserSettingsServices } from "../irrigant-settings.service";


export const irrigantSettingsService = new UserSettingsServices(
  new IrrigantPreferencesRepository(),
  new IrrigationUserRepository(),
  newsletterService
);

