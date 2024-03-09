import { Router } from "express";
import { setupCropRoutes } from "./crop";
import { setupStudiesRoutes } from "./studies";
import { setupWeightsRoutes } from "./weights";

export const managementRoutes = (): Router => {
  const router = Router();

  setupCropRoutes(router);
  setupStudiesRoutes(router);
  setupWeightsRoutes(router);

  return router;
};
