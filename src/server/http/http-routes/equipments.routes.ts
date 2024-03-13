import { Router } from "express";

import { adaptRoute } from "../adapters/express-route.adapter";

import {
  authorization,
  registerManagerWriteAccessAuth,
} from "../http-middlewares";

import { EquipmentsControllerFactory } from "../factories/controllers";
import { SystemLogsControllersFactory } from "../factories/controllers";

export const equipmentsRouter = (): Router => {
  const router = Router();

  router.post(
    "/organ",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(EquipmentsControllerFactory.makeCreateMeteorologicalOrgan())
  );

  router.delete(
    "/organ/:id",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(EquipmentsControllerFactory.makeDeleteMeteorologicalOrgan())
  );

  router.put(
    "/organ/:id",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(EquipmentsControllerFactory.makeUpdateMeteorologicalOrgan())
  );
  router.get(
    "/organ",
    authorization,
    adaptRoute(EquipmentsControllerFactory.makeFetchMeteorologicalOrgan())
  );
  router.post(
    "/",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(EquipmentsControllerFactory.makeCreateEquipments())
  );

  router.delete(
    "/:id",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(EquipmentsControllerFactory.makeDeleteEquipment())
  );

  router.put(
    "/:id",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(EquipmentsControllerFactory.makeUpdateEquipment())
  );

  router.get(
    "/",
    authorization,
    adaptRoute(EquipmentsControllerFactory.makeFetchEquipments())
  );

  router.get(
    "/pluviometers",
    adaptRoute(
      EquipmentsControllerFactory.makeFetchPluviometersWithLastMeasurements()
    )
  );

  router.get(
    "/stations",
    adaptRoute(
      EquipmentsControllerFactory.makeFetchStationsWithLastMeasurements()
    )
  );

  router.get(
    "/measures/pluviometers",
    authorization,
    adaptRoute(EquipmentsControllerFactory.makeFetchPluviometersReads())
  );

  router.get(
    "/measures/pluviometer/:id",
    authorization,
    adaptRoute(EquipmentsControllerFactory.makeFetchPluviometerReadsByIdRead())
  );

  router.put(
    "/measures/pluviometer/:id",
    authorization,
    adaptRoute(EquipmentsControllerFactory.makeUpdatePluviometerMeasures())
  );

  router.put(
    "/measures/station/:id",
    authorization,
    adaptRoute(EquipmentsControllerFactory.makeUpdateStationMeasures())
  );

  router.get(
    "/measures/stations",
    authorization,
    adaptRoute(EquipmentsControllerFactory.makeFetchStationsReads())
  );

  router.get(
    "/measures/station/:id",
    authorization,
    adaptRoute(EquipmentsControllerFactory.makeFetchStationReadsByIdRead())
  );

  router.get(
    "/logs/:id",
    authorization,
    adaptRoute(SystemLogsControllersFactory.makeFetchEquipmentMeasuresLogs())
  );

  return router;
};
