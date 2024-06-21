import { Router } from "express";
import { adaptRouteV2 } from "../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../server/http/http-middlewares";
import { ManagementCropControllers } from "../controllers/crop.controller";
import { IrrigantControllers } from "../controllers/irrigant.controller";

export const setupManagementV2Routes = (router: Router): void => {
  router.get(
    "/management/crop/:id",
    adaptRouteV2(ManagementCropControllers.getCropById)
  );

  router.post(
    "/management/crop",
    authorization,
    adaptRouteV2(ManagementCropControllers.createCrop)
  );

  router.put(
    "/management/crop/:id",
    authorization,
    adaptRouteV2(ManagementCropControllers.updateCrop)
  );

  router.delete(
    "/management/crop/:id",
    authorization,
    adaptRouteV2(ManagementCropControllers.deleteCrop)
  );

  router.get(
    "/management/crop/cycles/:id",
    adaptRouteV2(ManagementCropControllers.getAllCropCycles)
  );
  router.post(
    "/management/crop/cycles/:id",
    authorization,
    adaptRouteV2(ManagementCropControllers.createCropCycles)
  );

  //Irrigant
  router.get(
    "/management/crops",
    adaptRouteV2(ManagementCropControllers.getAllCrops)
  );

  router.post(
    "/management/blade_suggestion",
    adaptRouteV2(IrrigantControllers.getBladeIrrigation)
  );

  router.post(
    "/management/user/irrigation_crops",
    authorization,
    adaptRouteV2(IrrigantControllers.saveUserIrrigationCrops)
  );

  router.get(
    "/management/user/irrigation_crops",
    authorization,
    adaptRouteV2(IrrigantControllers.getAllUserIrrigationCrops)
  );

  router.get(
    "/management/user/irrigation_crops/:id",
    authorization,
    adaptRouteV2(IrrigantControllers.getUserIrrigationCropsById)
  );

  router.get(
    "/management/user/irrigation_crops/recommendation/:id",
    authorization,
    adaptRouteV2(IrrigantControllers.calcUserIrrigationRecommendationById)
  );

  router.delete(
    "/management/user/irrigation_crops/:id",
    authorization,
    adaptRouteV2(IrrigantControllers.deleteUserIrrigationCrops)
  );

  router.patch(
    "/management/user/irrigation_crops/:id",
    authorization,
    adaptRouteV2(IrrigantControllers.updateUserIrrigationCropsById)
  );

  router.post(
    "/management/user/equipments",
    authorization,
    adaptRouteV2(IrrigantControllers.saveUserEquipments)
  );

  router.delete(
    "/management/user/equipments/:id",
    authorization,
    adaptRouteV2(IrrigantControllers.deleteUserEquipments)
  );

  router.patch(
    "/management/user/equipments",
    authorization,
    adaptRouteV2(IrrigantControllers.updateUserEquipments)
  );
  router.get(
    "/management/user/equipments",
    authorization,
    adaptRouteV2(IrrigantControllers.getUserEquipments)
  );
};
