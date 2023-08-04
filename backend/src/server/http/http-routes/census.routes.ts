import { Router } from "express";

import { adaptRoute } from "../adapters/express-route.adapter";

import { authorization } from "../http-middlewares";

import {
  makeFetchAnimalsCensusByBasinController,
  makeFetchAnimalsCensusByCityController,
  makeFetchAnimalsCensusByConsumptionController,
  makeFetchAquacultureCensusByBasinController,
  makeFetchAquacultureCensusByCountyController,
  makeFetchCensusTakersCensusByBasinController,
  makeFetchCensusTakersCensusByCountyController,
  makeFetchEconomicSecurityCensusByBasinController,
  makeFetchProductivitySecurityCensusByBasinController,
  makeFetchProductivitySecurityCensusByCountyController,
  makeFetchSocialSecurityCensusByBasinController,
  makeFetchSocialSecurityCensusByCountyController,
  makeFetchWaterSecurityCensusByBasinController,
  makeFetchWaterSecurityCensusByCountyController,
} from "../factories/controllers";
import { makeFetchEconomicSecurityCensusByCountyController } from "../factories/controllers/indicators-census/fetch-economic-security-by-county-controller.factory";
import {
  makeFetchCaptationCensusByBasinController,
  makeFetchCaptationCensusByCountyController,
} from "../factories/controllers/captation-census";

export const censusRouter = (): Router => {
  const router = Router();

  router.get(
    "/animals/consumption",
    authorization,
    adaptRoute(makeFetchAnimalsCensusByConsumptionController())
  );

  router.get(
    "/animals/basin",
    authorization,
    adaptRoute(makeFetchAnimalsCensusByBasinController())
  );

  router.get(
    "/animals/county",
    authorization,
    adaptRoute(makeFetchAnimalsCensusByCityController())
  );

  router.get(
    "/aquaculture/basin",
    authorization,
    adaptRoute(makeFetchAquacultureCensusByBasinController())
  );

  router.get(
    "/aquaculture/county",
    authorization,
    adaptRoute(makeFetchAquacultureCensusByCountyController())
  );

  router.get(
    "/census-takers/basin",
    authorization,
    adaptRoute(makeFetchCensusTakersCensusByBasinController())
  );

  router.get(
    "/census-takers/county",
    authorization,
    adaptRoute(makeFetchCensusTakersCensusByCountyController())
  );

  router.get(
    "/indicator/security/water/basin",
    authorization,
    adaptRoute(makeFetchWaterSecurityCensusByBasinController())
  );

  router.get(
    "/indicator/security/water/county",
    authorization,
    adaptRoute(makeFetchWaterSecurityCensusByCountyController())
  );

  router.get(
    "/indicator/security/social/basin",
    authorization,
    adaptRoute(makeFetchSocialSecurityCensusByBasinController())
  );

  router.get(
    "/indicator/security/social/county",
    authorization,
    adaptRoute(makeFetchSocialSecurityCensusByCountyController())
  );

  router.get(
    "/indicator/security/economic/basin",
    authorization,
    adaptRoute(makeFetchEconomicSecurityCensusByBasinController())
  );

  router.get(
    "/indicator/security/economic/county",
    authorization,
    adaptRoute(makeFetchEconomicSecurityCensusByCountyController())
  );

  router.get(
    "/indicator/security/productive/basin",
    authorization,
    adaptRoute(makeFetchProductivitySecurityCensusByBasinController())
  );

  router.get(
    "/indicator/security/productive/county",
    authorization,
    adaptRoute(makeFetchProductivitySecurityCensusByCountyController())
  );

  router.get(
    "/captation/basin",
    authorization,
    adaptRoute(makeFetchCaptationCensusByBasinController())
  );

  router.get(
    "/captation/county",
    authorization,
    adaptRoute(makeFetchCaptationCensusByCountyController())
  );

  return router;
};
