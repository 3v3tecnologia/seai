import { Router } from "express";
import { adaptRouteV2 } from "../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../server/http/http-middlewares";
import { ManagementCropControllers } from "../controllers/crop.controller";
import { IrrigantControllers } from "../controllers/irrigant.controller";

export const setupManagementV2Routes = (router: Router): void => {

  router.get("/management/crop/:id", adaptRouteV2(ManagementCropControllers.getCropById));

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
  router.get("/management/crops", adaptRouteV2(ManagementCropControllers.getAllCrops));

  router.post(
    "/management/blade_suggestion",
    adaptRouteV2(IrrigantControllers.getBladeIrrigation)
  );

  router.post(
    "/management/user/irrigation_recommendation",
    authorization,
    adaptRouteV2(IrrigantControllers.saveRecommendation)
  );

  router.get(
    "/management/user/irrigation_recommendation",
    authorization,
    adaptRouteV2(IrrigantControllers.getAllRecommendationByUserId)
  );

  router.get(
    "/management/user/irrigation_recommendation/:id",
    authorization,
    adaptRouteV2(IrrigantControllers.getRecommendationById)
  );

  router.delete(
    "/management/user/irrigation_recommendation/:id",
    authorization,
    adaptRouteV2(IrrigantControllers.deleteRecommendation)
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

};
