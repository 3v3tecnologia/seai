import { Router } from "express";

import { adaptRoute } from "../adapters/express-route.adapter";
import {
  makeFetchAnimalsCensusByBasinController,
  makeFetchAnimalsCensusByCityController,
  makeFetchAnimalsCensusByConsumptionController,
} from "../factories/controllers/animals-census";

import { authorization } from "../http-middlewares";

export const reportsRouter = (): Router => {
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
    "/animals/city",
    authorization,
    adaptRoute(makeFetchAnimalsCensusByCityController())
  );

  return router;
};
