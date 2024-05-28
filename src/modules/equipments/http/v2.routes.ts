import { Router } from "express";
import { adaptRouteV2 } from "../../../server/http/adapters/express-route.adapter";
import { EquipmentsControllers, EquipmentsMeasurementsControllers } from "../controllers";
import { authorization } from "../../../server/http/http-middlewares";

export const setupEquipmentsRoutes = (): Router => {
    const router = Router();

    router.get(
        "/",
        authorization,
        adaptRouteV2(EquipmentsControllers.getAll)
    );
    router.get(
        "/types",
        authorization,
        adaptRouteV2(EquipmentsControllers.getAllEquipmentsTypes)
    );
    router.post(
        "/",
        // authorization,
        adaptRouteV2(EquipmentsControllers.bulkInsert)
    );

    router.get(
        "/last-updated-at",
        authorization,
        adaptRouteV2(EquipmentsControllers.getDateOfLastMeasurementTaken)
    );

    router.get(
        "/meteorological_organ/access_credentials",
        authorization,
        adaptRouteV2(EquipmentsControllers.getMeteorologicalOrganAccessCredentials)
    );

    router.get(
        "/measurements",
        authorization,
        adaptRouteV2(EquipmentsMeasurementsControllers.getByEquipmentsCodesAndDate)
    );

    router.post(
        "/measurements/",
        // authorization,
        adaptRouteV2(EquipmentsMeasurementsControllers.bulkInsert)
    );

    return router

};
