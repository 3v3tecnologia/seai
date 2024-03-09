import { Router } from "express";
import { ManagementCropControllers } from "../../../../presentation/controllers/management/crop.controller";
import { adaptRouteV2 } from "../../adapters/express-route.adapter";
import { authorization } from "../../http-middlewares";

export const setupCropRoutes = (router: Router): void => {
  router.post(
    "/crop",
    authorization,
    adaptRouteV2(ManagementCropControllers.create)
  );

  router.put(
    "/crop/:id",
    authorization,
    adaptRouteV2(ManagementCropControllers.update)
  );

  router.delete(
    "/crop/:id",
    authorization,
    adaptRouteV2(ManagementCropControllers.delete)
  );

  router.get(
    "/crop/:id",
    authorization,
    adaptRouteV2(ManagementCropControllers.getById)
  );

  router.get(
    "/crop",
    authorization,
    adaptRouteV2(ManagementCropControllers.getAll)
  );
};
