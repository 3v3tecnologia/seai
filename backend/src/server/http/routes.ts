import { Express, Router } from "express";

import { userRouter } from "./http-routes";

export function setRoutes(app: Express): void {
  const router = Router();

  app.get("/_health", (req, res) => {
    res.status(200).send("ok");
  });

  app.use("/api", router);

  router.use("/user", userRouter);
}
