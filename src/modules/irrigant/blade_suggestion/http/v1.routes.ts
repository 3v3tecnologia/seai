import { Router } from "express";
import { adaptRouteV2 } from "../../../../server/http/adapters/express-route.adapter";
import { IrrigantControllers } from "../controllers/irrigant.controller";

export const setupBladeSuggestionRoutes = (router: Router): void => {
  router.post(
    "/blade_suggestion",
    adaptRouteV2(IrrigantControllers.getBladeIrrigation)
  );
};
