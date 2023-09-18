import { Router } from "express";

import { adaptRoute } from "../adapters/express-route.adapter";

import { authorization } from "../http-middlewares";

import {
  makeFetchEquipmentsController,
  makeFetchPluviometersReadsController,
  makeFetchStationsReadsController,
} from "../factories/controllers/equipments";

export const equipmentsRouter = (): Router => {
  const router = Router();

  router.get("/", authorization, adaptRoute(makeFetchEquipmentsController()));

  router.get(
    "/measures/pluviometers",
    authorization,
    adaptRoute(makeFetchPluviometersReadsController())
  );

  router.get(
    "/measures/stations",
    authorization,
    adaptRoute(makeFetchStationsReadsController())
  );

  return router;
};
