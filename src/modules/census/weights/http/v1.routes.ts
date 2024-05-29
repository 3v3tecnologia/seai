import { Router } from "express";
import { adaptRoute } from "../../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../../server/http/http-middlewares";
import { MakeIndicatorsWeightsControllers } from './../controllers/indicators-weights-controller-factory';

export const setupIndicatorsWeightsRoutes = (): Router => {
  const router = Router();

  router.post(
    "/basin/:id",
    authorization,
    adaptRoute(MakeIndicatorsWeightsControllers.createIndicatorsWeights())
  );

  router.get(
    "/basin/:id",
    authorization,
    adaptRoute(MakeIndicatorsWeightsControllers.getIndicatorWeightsByBasin())
  );

  return router
};
