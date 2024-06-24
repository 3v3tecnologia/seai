import { Router } from "express";
import { adaptRouteV2 } from "../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../server/http/http-middlewares";
import { ManagementCropControllers } from "../controllers/crop.controller";

export const setupManagementCropV2Routes = (router: Router): void => {
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
};
