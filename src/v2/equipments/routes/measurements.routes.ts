import { Router } from "express";
import { adaptRouteV2 } from "../../../server/http/adapters/express-route.adapter";
import { EquipmentsMeasurementsControllers } from "../controllers";

export const setupEquipmentsMeasurementsRoutes = (router: Router): void => {
    // router.get(
    //     `${basePath}/`,
    //     adaptRouteV2(EquipmentsMeasurementsControllers.getByEquipmentsCodesAndDate)
    // );

    router.get(
        "/measurements",
        adaptRouteV2(EquipmentsMeasurementsControllers.getByEquipmentsCodesAndDate)
    );

    router.put(
        "/measurements/",
        adaptRouteV2(EquipmentsMeasurementsControllers.bulkUpdate)
    );



    router.post(
        "/measurements/",
        adaptRouteV2(EquipmentsMeasurementsControllers.bulkInsert)
    );

};
