import { Router } from "express";
import { adaptRouteV2 } from "../../../server/http/adapters/express-route.adapter";
import { IrrigantControllers } from "../controllers";

export const setupEquipmentsRoutes = (router: Router): void => {
    router.post(
        "/equipments",
        adaptRouteV2(IrrigantControllers.getBladeIrrigation)
    );
};
