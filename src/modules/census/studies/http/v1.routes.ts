import { Router } from "express";
import { adaptRouteV2 } from "../../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../../server/http/http-middlewares";
import { makeCensusStudiesControllers } from "../controllers/crop-studies.controller";

export const setupCropStudiesRoutes = (router: Router): void => {
  router.post(
    "/basin/:id",
    authorization,
    adaptRouteV2(makeCensusStudiesControllers().create)
  );

  router.get(
    "/basin/:id",
    authorization,
    adaptRouteV2(makeCensusStudiesControllers().getByBasin)
  );
};
