import { Router } from "express";
import { adaptHTTPHandler } from "../../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../../server/http/http-middlewares";
import { UserPreferencesControllers } from "../../controllers/irrigant-settings.controller";


export const setupUserIrrigantSettingsV2Routes = (): Router => {
  const router = Router();

  router.post(
    "/equipments",
    authorization,
    adaptHTTPHandler(UserPreferencesControllers.saveEquipments)
  );

  router.delete(
    "/equipments/:id",
    authorization,
    adaptHTTPHandler(UserPreferencesControllers.deleteEquipments)
  );

  router.patch(
    "/equipments",
    authorization,
    adaptHTTPHandler(UserPreferencesControllers.updateEquipments)
  );

  router.get(
    "/equipments",
    authorization,
    adaptHTTPHandler(UserPreferencesControllers.getEquipments)
  );

  router.patch(
    "/notifications/:id",
    authorization,
    adaptHTTPHandler(UserPreferencesControllers.updateUserNotificationPreference)
  );

  router.get(
    "/notifications",
    authorization,
    adaptHTTPHandler(UserPreferencesControllers.getUserNotificationsPreferences)
  );

  return router
};
