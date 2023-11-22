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
  makeCreateMeteorologicalOrganController,
  makeDeleteEquipmentsController,
  makeFetchMeteorologicalOrganController,
  makeUpdateEquipmentsController,
  makeFetchPluviometerReadsByIdReadController,
  makeFetchStationReadsByIdReadController,
} from "../factories/controllers/equipments";
import { makeFetchEquipmentMeasuresLogsController } from "../factories/controllers";
import { makeUpdatePluviometerMeasuresController } from "../factories/controllers/equipments/update-pluviometer-measures-controller.factory";
import { makeUpdateStationMeasuresController } from "../factories/controllers/equipments/update-station-measures-controller.factory";

export const equipmentsRouter = (): Router => {
  const router = Router();

  router.post(
    "/organ",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(makeCreateMeteorologicalOrganController())
  );

  router.delete(
    "/organ/:id",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(makeDeleteEquipmentsController())
  );

  router.put(
    "/organ/:id",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(makeUpdateEquipmentsController())
  );
  router.get(
    "/organ",
    authorization,
    adaptRoute(makeFetchMeteorologicalOrganController())
  );
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
    "/measures/pluviometer/:id",
    authorization,
    adaptRoute(makeFetchPluviometerReadsByIdReadController())
  );

  router.put(
    "/measures/pluviometer/:id",
    authorization,
    adaptRoute(makeUpdatePluviometerMeasuresController())
  );

  router.put(
    "/measures/station/:id",
    authorization,
    adaptRoute(makeUpdateStationMeasuresController())
  );

  router.get(
    "/measures/stations",
    authorization,
    adaptRoute(makeFetchStationsReadsController())
  );

  router.get(
    "/measures/station/:id",
    authorization,
    adaptRoute(makeFetchStationReadsByIdReadController())
  );

  router.get(
    "/logs/:id",
    authorization,
    adaptRoute(makeFetchEquipmentMeasuresLogsController())
  );

  return router;
};
