import { Router } from "express";
import { adaptRoute } from "../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../server/http/http-middlewares";
import { MakeIndicatorsWeightsControllers } from '../controllers/factories/indicators-weights-controller-factory';
import { MakeCropStudiesControllers } from "../controllers/factories/crop-studies-controllers.factory";

export const setupCensusV2Routes = (router: Router): void => {
  router.post(
    "/census/studies/basin/:id",
    authorization,
    adaptRoute(MakeCropStudiesControllers.createCropStudies())
  );

  router.get(
    "/census/studies/basin/:id",
    authorization,
    adaptRoute(MakeCropStudiesControllers.getCropStudiesByBasin())
  );

  router.get(
    "/census/weights/basin/calculated",
    authorization,
    adaptRoute(MakeIndicatorsWeightsControllers.calcIndicatorWeights())
  );

  router.post(
    "/census/weights/basin",
    authorization,
    adaptRoute(MakeIndicatorsWeightsControllers.createIndicatorsWeights())
  );

  router.get(
    "/census/weights/basin",
    authorization,
    adaptRoute(MakeIndicatorsWeightsControllers.getIndicatorWeightsByBasin())
  );
};
