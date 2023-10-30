import { Router } from "express";

import { adaptRoute } from "../adapters/express-route.adapter";

import {
  authorization,
  registerManagerWriteAccessAuth,
} from "../http-middlewares";

import {
  makeFetchEquipmentsController,
  makeFetchPluviometersReadsController,
  makeFetchStationsReadsController,
  makeCreateEquipmentsController,
} from "../factories/controllers/equipments";

export const equipmentsRouter = (): Router => {
  const router = Router();

  router.post(
    "/",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(makeCreateEquipmentsController())
  );
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
