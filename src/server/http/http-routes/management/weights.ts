import { Router } from "express";
import { authorization } from "../../http-middlewares";
import { ManagementWeightsController } from "../../../../presentation/controllers/management";
import { adaptRouteV2 } from "../../adapters/express-route.adapter";

export const setupWeightsRoutes = (router: Router): void => {
  router.post(
    "/weights/:id",
    authorization,
    adaptRouteV2(ManagementWeightsController.create)
  );

  router.get(
    "/weights/:id",
    authorization,
    adaptRouteV2(ManagementWeightsController.getByBasin)
  );

  router.delete(
    "/weights/:id",
    authorization,
    adaptRouteV2(ManagementWeightsController.delete)
  );
};
