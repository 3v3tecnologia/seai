import { Router } from "express";

import { adaptRoute } from "../adapters/express-route.adapter";

import { authorization, equipmentsPermissions } from "../http-middlewares";

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
    equipmentsPermissions.write,
    adaptRoute(EquipmentsControllerFactory.makeCreateEquipments())
  );

  router.delete(
    "/:id",
    authorization,
    equipmentsPermissions.write,
    adaptRoute(EquipmentsControllerFactory.makeDeleteEquipment())
  );

  router.put(
    "/:id",
    authorization,
    equipmentsPermissions.write,
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
    equipmentsPermissions.write,
    adaptRoute(
      EquipmentsMeasurementsControllerFactory.makeUpdatePluviometerMeasures()
    )
  );

  router.put(
    "/station/measurements/:id",
    authorization,
    equipmentsPermissions.write,
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
    equipmentsPermissions.read,
    adaptRoute(
      EquipmentsMeasurementsControllerFactory.makeFetchLatestEquipmentMeasurementsController()
    )
  );

  router.get(
    "/logs/:id",
    authorization,
    equipmentsPermissions.read,
    adaptRoute(SystemLogsControllersFactory.makeFetchEquipmentMeasuresLogs())
  );

  return router;
};
