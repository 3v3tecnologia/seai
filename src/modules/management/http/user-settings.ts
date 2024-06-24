import { Router } from "express";
import { adaptRouteV2 } from "../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../server/http/http-middlewares";
import {} from "../controllers/irrigantion-recommendation.controller";
import { UserIrrigantSettingsControllers } from "../controllers/user-setting.controller";

export const setupUserIrrigantSettingsV2Routes = (router: Router): void => {
  router.post(
    "/management/user/settings/equipments",
    authorization,
    adaptRouteV2(UserIrrigantSettingsControllers.saveEquipments)
  );

  router.delete(
    "/management/user/settings/equipments/:id",
    authorization,
    adaptRouteV2(UserIrrigantSettingsControllers.deleteEquipments)
  );

  router.patch(
    "/management/user/settings/equipments",
    authorization,
    adaptRouteV2(UserIrrigantSettingsControllers.updateEquipments)
  );

  router.get(
    "/management/user/settings/equipments",
    authorization,
    adaptRouteV2(UserIrrigantSettingsControllers.getEquipments)
  );
};
