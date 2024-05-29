import { MakeCropStudiesControllers } from './../controllers/crop-studies-controllers.factory';
import { Router } from "express";
import { adaptRoute } from "../../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../../server/http/http-middlewares";

export const setupCropStudiesRoutes = (router: Router): void => {
  router.post(
    "/basin/:id",
    authorization,
    adaptRoute(MakeCropStudiesControllers.createCropStudies())
  );

  router.get(
    "/basin/:id",
    authorization,
    adaptRoute(MakeCropStudiesControllers.getCropStudiesByBasin())
  );
};
