import { Router } from "express";

import { adaptRoute } from "../adapters/express-route.adapter";

import { authorization } from "../http-middlewares";

import {
  EquipmentsControllerFactory,
  EquipmentsMeasurementsControllerFactory,
} from "../factories/controllers";
import { SystemLogsControllersFactory } from "../factories/controllers";

export const equipmentsRouter = (): Router => {
  const router = Router();

  router.post(
    "/organ",
    authorization,
    adaptRoute(EquipmentsControllerFactory.makeCreateMeteorologicalOrgan())
  );

  router.delete(
    "/organ/:id",
    authorization,
    adaptRoute(EquipmentsControllerFactory.makeDeleteMeteorologicalOrgan())
  );

  router.put(
    "/organ/:id",
    authorization,
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
    adaptRoute(EquipmentsControllerFactory.makeCreateEquipments())
  );

  router.delete(
    "/:id",
    authorization,
    adaptRoute(EquipmentsControllerFactory.makeDeleteEquipment())
  );

  router.put(
    "/:id",
    authorization,
    adaptRoute(EquipmentsControllerFactory.makeUpdateEquipment())
  );

  router.get(
    "/",
    authorization,
    adaptRoute(EquipmentsControllerFactory.makeFetchEquipments())
  );

  // Irrigant
  router.get(
    "/activated",
    adaptRoute(
      EquipmentsControllerFactory.makeFetchEquipmentsWithYesterdayMeasurementsController()
    )
  );

  router.put(
    "/pluviometer/measurements/:id",
    authorization,
    adaptRoute(
      EquipmentsMeasurementsControllerFactory.makeUpdatePluviometerMeasures()
    )
  );

  router.put(
    "/station/measurements/:id",
    authorization,
    adaptRoute(
      EquipmentsMeasurementsControllerFactory.makeUpdateStationMeasurements()
    )
  );

  router.put(
    "/measurements/et0",
    adaptRoute(EquipmentsMeasurementsControllerFactory.makeUpdateEt0())
  );

  router.get(
    "/:id/measurements",
    authorization,
    adaptRoute(
      EquipmentsMeasurementsControllerFactory.makeFetchLatestEquipmentMeasurementsController()
    )
  );

  router.get(
    "/logs/:id",
    authorization,
    adaptRoute(SystemLogsControllersFactory.makeFetchEquipmentMeasuresLogs())
  );

  return router;
};
