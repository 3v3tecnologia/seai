import { Router } from "express";
import { adaptRouteV2 } from "../../../server/http/adapters/express-route.adapter";
import { EquipmentsControllers } from "../controllers";

export const setupEquipmentsRoutes = (router: Router): void => {
    router.get(
        "/",
        adaptRouteV2(EquipmentsControllers.getAll)
    );
    router.get(
        "/types",
        adaptRouteV2(EquipmentsControllers.getAllEquipmentsTypes)
    );
    router.post(
        "/",
        adaptRouteV2(EquipmentsControllers.bulkInsert)
    );

    router.get(
        "/meteorological_organ/access_credentials",
        adaptRouteV2(EquipmentsControllers.getMeteorologicalOrganAccessCredentials)
    );


};
