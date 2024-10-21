import { IrrigantPreferencesRepository } from "../../infra/repository/irrigation-settings.repository";
import { UserSettingsServices } from "../irrigant-settings.service";


export const irrigantSettingsService = new UserSettingsServices(
  new IrrigantPreferencesRepository()
);

