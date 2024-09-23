import { Router } from "express";
import { adaptHTTPHandler } from "../../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../../server/http/http-middlewares";
import { UserPreferencesControllers } from "../../controllers/irrigant-settings.controller";


export const setupUserIrrigantSettingsV2Routes = (router: Router): void => {

  router.post(
    "/management/user/settings/equipments",
    authorization,
    adaptHTTPHandler(UserPreferencesControllers.saveEquipments)
  );

  router.delete(
    "/management/user/settings/equipments/:id",
    authorization,
    adaptHTTPHandler(UserPreferencesControllers.deleteEquipments)
  );

  router.patch(
    "/management/user/settings/equipments",
    authorization,
    adaptHTTPHandler(UserPreferencesControllers.updateEquipments)
  );

  router.get(
    "/management/user/settings/equipments",
    authorization,
    adaptHTTPHandler(UserPreferencesControllers.getEquipments)
  );

  router.patch(
    "/management/user/settings/notifications/:id",
    authorization,
    adaptHTTPHandler(UserPreferencesControllers.updateUserNotificationPreference)
  );

  router.get(
    "/management/user/settings/notifications",
    authorization,
    adaptHTTPHandler(UserPreferencesControllers.getUserNotificationsPreferences)
  );
};
