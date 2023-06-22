import { Express, Router } from "express";

import { loginRouter, userRouter } from "./http-routes";

export function setRoutes(app: Express): void {
  const router = Router();

  router.use("/user", userRouter(router));
  router.use("/login", loginRouter(router));

  app.get("/_health", (req, res) => {
    res.status(200).send("ok");
  });

  app.use("/api", router);
}
