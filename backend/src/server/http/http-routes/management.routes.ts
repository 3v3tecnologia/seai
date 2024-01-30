import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";

import { authorization } from "../http-middlewares";

import {
  makeDeleteStudiesByBasinController,
  makeGetStudiesByBasinController,
  makeDeleteWeightsByBasinController,
  makeGetWeightsByBasinController,
  makeInsertManagementStudiesController,
  makeInsertManagementWeightsController,
} from "../factories/controllers/management";

export const managementRouter = (): Router => {
  const router = Router();

  router.post(
    "/weights",
    authorization,
    adaptRoute(makeInsertManagementWeightsController())
  );

  router.get(
    "/weights/:id",
    authorization,
    adaptRoute(makeGetWeightsByBasinController())
  );

  router.delete(
    "/weights/:id",
    authorization,
    adaptRoute(makeDeleteWeightsByBasinController())
  );

  router.post(
    "/studies",
    authorization,
    adaptRoute(makeInsertManagementStudiesController())
  );

  router.get(
    "/studies/:id",
    authorization,
    adaptRoute(makeGetStudiesByBasinController())
  );

  router.delete(
    "/studies/:id",
    authorization,
    adaptRoute(makeDeleteStudiesByBasinController())
  );

  return router;
};
