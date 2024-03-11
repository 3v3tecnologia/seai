import { Router } from "express";
import { adaptRouteV2 } from "../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../server/http/http-middlewares";
import { ManagementStudiesControllers } from "../controllers";

export const setupStudiesRoutes = (router: Router): void => {
  router.post(
    "/studies/:id",
    authorization,
    adaptRouteV2(ManagementStudiesControllers.create)
  );

  router.get(
    "/studies/:id",
    authorization,
    adaptRouteV2(ManagementStudiesControllers.getByBasin)
  );

  router.delete(
    "/studies/:id",
    authorization,
    adaptRouteV2(ManagementStudiesControllers.delete)
  );
};
