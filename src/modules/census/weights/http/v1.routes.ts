import { Router } from "express";
import { adaptRoute } from "../../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../../server/http/http-middlewares";
import { MakeIndicatorsWeightsControllers } from './../controllers/indicators-weights-controller-factory';

export const setupIndicatorsWeightsRoutes = (router: Router): void => {
  router.get(
    "/weights/basin/calculated",
    authorization,
    adaptRoute(MakeIndicatorsWeightsControllers.calcIndicatorWeights())
  );

  router.post(
    "/weights/basin",
    authorization,
    adaptRoute(MakeIndicatorsWeightsControllers.createIndicatorsWeights())
  );

  router.get(
    "/weights/basin",
    authorization,
    adaptRoute(MakeIndicatorsWeightsControllers.getIndicatorWeightsByBasin())
  );

};
