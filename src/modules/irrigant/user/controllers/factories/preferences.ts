import { makeUserSettingsService } from "../../services/factories/user-settings";
import { UserPreferencesControllers } from "../preferences.controller";

export const makeUserIrrigantPreferencesControllers =
  (): UserPreferencesControllers => {
    return new UserPreferencesControllers(makeUserSettingsService());
  };
