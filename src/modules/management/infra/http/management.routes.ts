import { Router } from "express";
import { adaptRoute } from "../../../../server/http/adapters/express-route.adapter";
import { ManagementControllersFactory } from "../factories/controllers/management.controller.factory";
import { authorization } from "../../../../server/http/http-middlewares";

export const managementRouter = (): Router => {
  const router = Router();

  //   router.post(
  //     "/weights/:id",
  //     authorization,
  //     adaptRoute(ManagementControllersFactory.makeInsertManagementWeights())
  //   );

  router.get(
    "/weights/:id",
    authorization,
    adaptRoute(ManagementControllersFactory.makeGetWeightsByBasin())
  );

  //   router.delete(
  //     "/weights/:id",
  //     authorization,
  //     adaptRoute(ManagementControllersFactory.makeDeleteWeightsByBasin())
  //   );

  return router;
};
