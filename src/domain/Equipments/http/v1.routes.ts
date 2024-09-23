import { Router } from "express";
import { adaptHTTPHandler } from "../../../server/http/adapters/express-route.adapter";
import {
  authorization,
  equipmentsPermissions,
} from "../../../server/http/http-middlewares";
import { EquipmentsControllers } from "../controllers/equipments.controller";
import { EquipmentsMeasurementsControllers } from "../controllers/measurements.controller";

export const setEquipmentsV1Router = (router: Router): void => {
  router.get(
    "/equipments/organ",
    authorization,
    adaptHTTPHandler(EquipmentsControllers.fetchMeteorologicalOrgan)
  );

  router.put(
    "/equipments/:id",
    authorization,
    equipmentsPermissions.write,
    adaptHTTPHandler(EquipmentsControllers.update)
  );

  router.get(
    "/equipments/",
    authorization,
    adaptHTTPHandler(EquipmentsControllers.fetchAll)
  );

  // Irrigant
  router.get(
    "/equipments/activated",
    adaptHTTPHandler(
      EquipmentsControllers.getActivatedEquipments
    )
  );

  router.get(
    "/equipments/synchronized",
    adaptHTTPHandler(
      EquipmentsControllers.getSyncronizedEquipments
    )
  );

  router.put(
    "/equipments/pluviometer/measurements/:id",
    authorization,
    equipmentsPermissions.write,
    adaptHTTPHandler(EquipmentsMeasurementsControllers.updateByPluviometer)
  );

  router.put(
    "/equipments/station/measurements/:id",
    authorization,
    equipmentsPermissions.write,
    adaptHTTPHandler(EquipmentsMeasurementsControllers.updateByStation)
  );

  router.get(
    "/equipments/:id/measurements",
    authorization,
    equipmentsPermissions.read,
    adaptHTTPHandler(EquipmentsMeasurementsControllers.fetchLatest)
  );
};
