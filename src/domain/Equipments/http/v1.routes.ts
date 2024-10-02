import { Router } from "express";
import { adaptHTTPHandler } from "../../../server/http/adapters/express-route.adapter";
import {
  authorization,
  equipmentsPermissions,
} from "../../../server/http/http-middlewares";
import { EquipmentsControllers } from "../controllers/equipments.controller";
import { EquipmentsMeasurementsControllers } from "../controllers/measurements.controller";

export const setEquipmentsV1Router = (): Router => {
  const router = Router();

  router.get(
    "/organ",
    authorization,
    adaptHTTPHandler(EquipmentsControllers.fetchMeteorologicalOrgan)
  );

  router.put(
    "/:id",
    authorization,
    equipmentsPermissions.write,
    adaptHTTPHandler(EquipmentsControllers.update)
  );

  router.get(
    "/",
    authorization,
    adaptHTTPHandler(EquipmentsControllers.fetchAll)
  );

  // Irrigant
  router.get(
    "/activated",
    adaptHTTPHandler(
      EquipmentsControllers.getActivatedEquipments
    )
  );

  router.get(
    "/synchronized",
    adaptHTTPHandler(
      EquipmentsControllers.getSyncronizedEquipments
    )
  );

  router.put(
    "/pluviometer/measurements/:id",
    authorization,
    equipmentsPermissions.write,
    adaptHTTPHandler(EquipmentsMeasurementsControllers.updateByPluviometer)
  );

  router.put(
    "/station/measurements/:id",
    authorization,
    equipmentsPermissions.write,
    adaptHTTPHandler(EquipmentsMeasurementsControllers.updateByStation)
  );

  router.get(
    "/:id/measurements",
    authorization,
    equipmentsPermissions.read,
    adaptHTTPHandler(EquipmentsMeasurementsControllers.fetchLatest)
  );

  return router
};
