import { Router } from "express";
import { adaptRouteV2 } from "../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../server/http/http-middlewares";
import { ManagementWeightsController } from "../controllers";

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
};
