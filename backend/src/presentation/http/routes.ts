import { Express, Router } from "express";

import { userRoutes } from "../routes";

export function setRoutes(app: Express): void {
  const router = Router();

  app.use("/api", router);

  router.use("/user", userRoutes);
}
