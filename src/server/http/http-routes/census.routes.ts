import { Router } from "express";

import { adaptRoute } from "../adapters/express-route.adapter";

import { authorization } from "../http-middlewares";

import { makeGetCulturesIndicatorsFromBasin } from "../../../modules/census/controllers/factories/fetch-crop-indicators";
import { SecurityIndicatorsControllersFactory } from "../factories/controllers";

export const censusRouter = (): Router => {
  const router = Router();

  router.get(
    "/cultures/:id",
    authorization,
    adaptRoute(
      makeGetCulturesIndicatorsFromBasin()
    )
  );
  //locations
  router.get(
    "/locations",
    authorization,
    adaptRoute(SecurityIndicatorsControllersFactory.makeFetchCensusLocations())
  );



  return router;
};
