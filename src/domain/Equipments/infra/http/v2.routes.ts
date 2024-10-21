import { Router } from "express";
import { EquipmentsControllers, EquipmentsMeasurementsControllers } from "../../controllers";
import { adaptHTTPHandler } from "../../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../../server/http/http-middlewares";


export const setupEquipmentsV2Routes = (router: Router): void => {
  router.get(
    "/equipments",
    authorization,
    adaptHTTPHandler(EquipmentsControllers.getAll)
  );

  router.get(
    "/equipments/types",
    authorization,
    adaptHTTPHandler(EquipmentsControllers.getAllEquipmentsTypes)
  );

  router.post(
    "/equipments",
    authorization,
    adaptHTTPHandler(EquipmentsControllers.bulkInsert)
  );

  router.get(
    "/equipments/last-updated-at",
    // authorization,
    adaptHTTPHandler(EquipmentsControllers.getDateOfLastMeasurementTaken)
  );

  router.get(
    "/equipments/meteorological_organ/access_credentials",
    authorization,
    adaptHTTPHandler(
      EquipmentsControllers.getMeteorologicalOrganAccessCredentials
    )
  );

  router.get(
    "/equipments/measurements",
    authorization,
    adaptHTTPHandler(
      EquipmentsMeasurementsControllers.getByEquipmentsCodesAndDate
    )
  );

  router.post(
    "/equipments/measurements",
    adaptHTTPHandler(EquipmentsMeasurementsControllers.bulkInsert)
  );
};
