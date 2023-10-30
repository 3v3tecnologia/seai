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
  makeDeleteEquipmentController,
  makeUpdateEquipmentController,
} from "../factories/controllers/equipments";

export const equipmentsRouter = (): Router => {
  const router = Router();

  router.post(
    "/",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(makeCreateEquipmentsController())
  );

  router.delete(
    "/:id",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(makeDeleteEquipmentController())
  );

  router.put(
    "/:id",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(makeUpdateEquipmentController())
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
