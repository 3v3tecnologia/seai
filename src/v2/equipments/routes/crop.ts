import { Router } from "express";
import { adaptRouteV2 } from "../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../server/http/http-middlewares";
import { ManagementCropControllers } from "../controllers";

export const setupCropRoutes = (router: Router): void => {
  router.post(
    "/crop",
    authorization,
    adaptRouteV2(ManagementCropControllers.createCrop)
  );

  router.put(
    "/crop/:id",
    authorization,
    adaptRouteV2(ManagementCropControllers.updateCrop)
  );

  router.delete(
    "/crop/:id",
    authorization,
    adaptRouteV2(ManagementCropControllers.deleteCrop)
  );

  router.get("/crop/:id", adaptRouteV2(ManagementCropControllers.getCropById));

  router.get("/crop", adaptRouteV2(ManagementCropControllers.getAllCrops));

  router.get(
    "/crop/cycles/:id",
    adaptRouteV2(ManagementCropControllers.getAllCropCycles)
  );
  router.post(
    "/crop/cycles/:id",
    authorization,
    adaptRouteV2(ManagementCropControllers.createCropCycles)
  );
};
