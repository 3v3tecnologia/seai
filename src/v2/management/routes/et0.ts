import { Router } from "express";
import { adaptRouteV2 } from "../../../server/http/adapters/express-route.adapter";
import { IrrigantControllers } from "../controllers";

export const setupCalcEt0Routes = (router: Router): void => {
  router.post(
    "/calc_eto",
    adaptRouteV2(IrrigantControllers.getBladeIrrigation)
  );
};
