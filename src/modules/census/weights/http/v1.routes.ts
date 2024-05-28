import { Router } from "express";
import { adaptRouteV2 } from "../../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../../server/http/http-middlewares";
import { makeIndicatorWeightsController } from "../controllers/indicators-weights.controller";

export const setupIndicatorsWeightsRoutes = (): Router => {
  const router = Router();

  router.post(
    "/basin/:id",
    authorization,
    adaptRouteV2(makeIndicatorWeightsController().create)
  );

  router.get(
    "/basin/:id",
    authorization,
    adaptRouteV2(makeIndicatorWeightsController().getByBasin)
  );

  return router
};
