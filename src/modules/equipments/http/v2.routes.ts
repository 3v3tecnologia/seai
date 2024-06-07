import { Router } from "express";
import { adaptRouteV2 } from "../../../server/http/adapters/express-route.adapter";
import { EquipmentsControllers, EquipmentsMeasurementsControllers } from "../controllers";
import { authorization } from "../../../server/http/http-middlewares";

export const setupEquipmentsV2Routes = (router: Router): void => {
    router.get(
        "/equipments",
        authorization,
        adaptRouteV2(EquipmentsControllers.getAll)
    );
    router.get(
        "/equipments/types",
        authorization,
        adaptRouteV2(EquipmentsControllers.getAllEquipmentsTypes)
    );
    router.post(
        "/equipments",
        // authorization,
        adaptRouteV2(EquipmentsControllers.bulkInsert)
    );

    router.get(
        "/equipments/last-updated-at",
        authorization,
        adaptRouteV2(EquipmentsControllers.getDateOfLastMeasurementTaken)
    );

    router.get(
        "/equipments/meteorological_organ/access_credentials",
        authorization,
        adaptRouteV2(EquipmentsControllers.getMeteorologicalOrganAccessCredentials)
    );

    router.get(
        "/equipments/measurements",
        authorization,
        adaptRouteV2(EquipmentsMeasurementsControllers.getByEquipmentsCodesAndDate)
    );

    router.post(
        "/equipments/measurements",
        // authorization,
        adaptRouteV2(EquipmentsMeasurementsControllers.bulkInsert)
    );

};
