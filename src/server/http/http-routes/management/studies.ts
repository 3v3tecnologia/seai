import { Router } from "express";
import { authorization } from "../../http-middlewares";
import { adaptRouteV2 } from "../../adapters/express-route.adapter";
import { ManagementStudiesControllers } from "../../../../presentation/controllers/management";

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
