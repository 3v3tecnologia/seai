import { Router } from "express";
import { adaptRouteV2 } from "../../../server/http/adapters/express-route.adapter";
import { EquipmentsMeasurementsControllers } from "../controllers";
import { authorization } from "../../../server/http/http-middlewares";

export const setupEquipmentsMeasurementsRoutes = (router: Router): void => {

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

};
