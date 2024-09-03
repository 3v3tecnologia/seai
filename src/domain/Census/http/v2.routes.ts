import { Router } from "express";
import { adaptRoute } from "../../../server/http/adapters/express-route.adapter";
import {
  authorization,
  studiesPermissions,
  weightsPermissions,
} from "../../../server/http/http-middlewares";
import { MakeIndicatorsWeightsControllers } from "../controllers/factories/indicators-weights-controller-factory";
import { MakeCropStudiesControllers } from "../controllers/factories/crop-studies-controllers.factory";

export const setupCensusV2Routes = (router: Router): void => {
  router.post(
    "/census/studies/basin/:id",
    authorization,
    studiesPermissions.write,
    adaptRoute(MakeCropStudiesControllers.createCropStudies())
  );

  router.get(
    "/census/studies/basin/:id",
    authorization,
    studiesPermissions.read,
    adaptRoute(MakeCropStudiesControllers.getCropStudiesByBasin())
  );

  router.post(
    "/census/weights/basin/calculate",
    authorization,
    weightsPermissions.write,
    adaptRoute(MakeIndicatorsWeightsControllers.calcIndicatorWeights())
  );

  router.post(
    "/census/weights/basin",
    authorization,
    weightsPermissions.write,
    adaptRoute(MakeIndicatorsWeightsControllers.createIndicatorsWeights())
  );

  router.get(
    "/census/weights/basin/:year/:basin_ids",
    authorization,
    weightsPermissions.read,
    adaptRoute(MakeIndicatorsWeightsControllers.getIndicatorWeightsByBasin())
  );

  router.post(
    "/census/water-cut",
    authorization,
    weightsPermissions.read,
    adaptRoute(MakeIndicatorsWeightsControllers.getWaterCut())
  );
  router.get(
    "/census/basin",
    authorization,
    weightsPermissions.read,
    adaptRoute(MakeIndicatorsWeightsControllers.getBasin())
  );
};