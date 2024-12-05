import { Router } from "express";
import { adaptHTTPHandler } from "../../../../server/http/adapters/express-route.adapter";
import {
  authorization,
  weightsPermissions,
} from "../../../../server/http/http-middlewares";
import { IndicatorsWeightsController } from "../../controllers/indicators-weights.controller";

export const setupCensusV2Routes = (router: Router): void => {

  router.post(
    "/census/weights/basin/calculate",
    authorization,
    weightsPermissions.write,
    adaptHTTPHandler(IndicatorsWeightsController.calculateWeights)
  );

  router.post(
    "/census/weights/basin",
    authorization,
    weightsPermissions.write,
    adaptHTTPHandler(IndicatorsWeightsController.create)
  );

  router.get(
    "/census/weights/basin/:year/:basin_ids",
    authorization,
    weightsPermissions.read,
    adaptHTTPHandler(IndicatorsWeightsController.getByBasinIds)
  );

  router.post(
    "/census/water-cut",
    authorization,
    weightsPermissions.read,
    adaptHTTPHandler(IndicatorsWeightsController.getWaterCut)
  );

  router.get(
    "/census/basin",
    authorization,
    weightsPermissions.read,
    adaptHTTPHandler(IndicatorsWeightsController.getBasin)
  );
};
