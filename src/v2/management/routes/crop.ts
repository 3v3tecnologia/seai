import { Router } from "express";
import { adaptRouteV2 } from "../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../server/http/http-middlewares";
import { ManagementCropControllers } from "../controllers";

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

  router.get("/crop/:id", adaptRouteV2(ManagementCropControllers.getCropById));

  router.get("/crop", adaptRouteV2(ManagementCropControllers.getAll));
};
