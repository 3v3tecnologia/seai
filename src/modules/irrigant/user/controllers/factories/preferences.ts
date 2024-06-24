import { IrrigantPreferencesRepository } from "../../repositories/user-preferences.repository";
import { UserSettingsServices } from "../../services/user-settings";
import { UserPreferencesControllers } from "../preferences.controller";

export const makeUserIrrigantPreferencesControllers =
  (): UserPreferencesControllers => {
    return new UserPreferencesControllers(
      new UserSettingsServices(new IrrigantPreferencesRepository())
    );
  };
