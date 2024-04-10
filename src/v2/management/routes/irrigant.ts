import { Router } from "express";
import { adaptRouteV2 } from "../../../server/http/adapters/express-route.adapter";
import { IrrigantControllers } from "../controllers";

export const setupIrrigationRoutes = (router: Router): void => {
  router.post(
    "/blade_irrigation",
    adaptRouteV2(IrrigantControllers.getBladeIrrigation)
  );
};
