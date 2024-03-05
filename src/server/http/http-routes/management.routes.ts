import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";

import { authorization } from "../http-middlewares";
import { ManagementControllersFactory } from "../factories/controllers";

export const managementRouter = (): Router => {
  const router = Router();

  router.post(
    "/weights/:id",
    authorization,
    adaptRoute(ManagementControllersFactory.makeInsertManagementWeights())
  );

  router.get(
    "/weights/:id",
    authorization,
    adaptRoute(ManagementControllersFactory.makeGetWeightsByBasin())
  );

  router.delete(
    "/weights/:id",
    authorization,
    adaptRoute(ManagementControllersFactory.makeDeleteWeightsByBasin())
  );

  router.post(
    "/studies/:id",
    authorization,
    adaptRoute(ManagementControllersFactory.makeInsertManagementStudies())
  );

  router.get(
    "/studies/:id",
    authorization,
    adaptRoute(ManagementControllersFactory.makeGetStudiesByBasin())
  );

  router.delete(
    "/studies/:id",
    authorization,
    adaptRoute(ManagementControllersFactory.makeDeleteStudiesByBasin())
  );

  return router;
};
