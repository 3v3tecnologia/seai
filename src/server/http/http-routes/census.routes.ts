import { Router } from "express";

import { adaptRoute } from "../adapters/express-route.adapter";

import { authorization } from "../http-middlewares";

import { makeGetCulturesIndicatorsFromBasin } from "../../../modules/census/crops/controllers/factories/fetch-crop-indicators";
import { setupIndicatorsWeightsRoutes } from "../../../modules/census/weights/http/v1.routes";
import { CensusControllersFactory, SecurityIndicatorsControllersFactory } from "../factories/controllers";
import { MakeCropStudiesControllers } from './../../../modules/census/studies/controllers/crop-studies-controllers.factory';

export const censusRouter = (): Router => {
  const router = Router();


  router.post("/studies/basin/:id", authorization, adaptRoute(MakeCropStudiesControllers.createCropStudies()))
  router.get("/studies/basin/:id", authorization, adaptRoute(MakeCropStudiesControllers.getCropStudiesByBasin()))

  setupIndicatorsWeightsRoutes(router)

  router.get(
    "/cultures/:id",
    authorization,
    adaptRoute(
      makeGetCulturesIndicatorsFromBasin()
    )
  );

  router.get(
    "/animals/consumption",
    authorization,
    adaptRoute(CensusControllersFactory.makeFetchAnimalsCensusByConsumption())
  );

  router.get(
    "/animals/basin",
    authorization,
    adaptRoute(CensusControllersFactory.makeFetchAnimalsCensusByBasin())
  );

  router.get(
    "/animals/county",
    authorization,
    adaptRoute(CensusControllersFactory.makeFetchAnimalsCensusByCity())
  );

  router.get(
    "/aquaculture/basin",
    authorization,
    adaptRoute(CensusControllersFactory.makeFetchAquacultureCensusByBasin())
  );

  router.get(
    "/aquaculture/county",
    authorization,
    adaptRoute(CensusControllersFactory.makeFetchAquacultureCensusByCounty())
  );

  router.get(
    "/census-takers/basin",
    authorization,
    adaptRoute(CensusControllersFactory.makeFetchCensusTakersCensusByBasin())
  );

  router.get(
    "/census-takers/county",
    authorization,
    adaptRoute(CensusControllersFactory.makeFetchCensusTakersCensusByCounty())
  );

  router.get(
    "/indicator/security/water/basin",
    authorization,
    adaptRoute(
      SecurityIndicatorsControllersFactory.makeFetchWaterSecurityCensusByBasin()
    )
  );

  router.get(
    "/indicator/security/water/county",
    authorization,
    adaptRoute(
      SecurityIndicatorsControllersFactory.makeFetchWaterSecurityCensusByCounty()
    )
  );

  router.get(
    "/indicator/security/social/basin",
    authorization,
    adaptRoute(
      SecurityIndicatorsControllersFactory.makeFetchSocialSecurityCensusByBasin()
    )
  );

  router.get(
    "/indicator/security/social/county",
    authorization,
    adaptRoute(
      SecurityIndicatorsControllersFactory.makeFetchSocialSecurityCensusByCounty()
    )
  );

  router.get(
    "/indicator/security/economic/basin",
    authorization,
    adaptRoute(
      SecurityIndicatorsControllersFactory.makeFetchEconomicSecurityCensusByBasin()
    )
  );

  router.get(
    "/indicator/security/economic/county",
    authorization,
    adaptRoute(
      SecurityIndicatorsControllersFactory.makeFetchEconomicSecurityCensusByCounty()
    )
  );

  // daqui em diante
  router.get(
    "/indicator/security/productive/basin",
    authorization,
    adaptRoute(
      SecurityIndicatorsControllersFactory.makeFetchProductivitySecurityCensusByBasin()
    )
  );

  router.get(
    "/indicator/security/productive/county",
    authorization,
    adaptRoute(
      SecurityIndicatorsControllersFactory.makeFetchProductivitySecurityCensusByCounty()
    )
  );

  router.get(
    "/captation/basin",
    authorization,
    adaptRoute(CensusControllersFactory.makeFetchCaptationCensusByBasin())
  );

  router.get(
    "/captation/county",
    authorization,
    adaptRoute(CensusControllersFactory.makeFetchCaptationCensusByCounty())
  );

  router.get(
    "/captation/tank/basin",
    authorization,
    adaptRoute(CensusControllersFactory.makeFetchCaptationTankCensusByBasin())
  );

  router.get(
    "/captation/tank/county",
    authorization,
    adaptRoute(CensusControllersFactory.makeFetchCaptationTankCensusByCounty())
  );

  router.get(
    "/workers/basin",
    authorization,
    adaptRoute(CensusControllersFactory.makeFetchWorkersCensusByBasin())
  );

  router.get(
    "/workers/county",
    authorization,
    adaptRoute(CensusControllersFactory.makeFetchWorkersCensusByCounty())
  );

  //locations
  router.get(
    "/locations",
    authorization,
    adaptRoute(SecurityIndicatorsControllersFactory.makeFetchCensusLocations())
  );



  return router;
};
