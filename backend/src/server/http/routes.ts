import { Express, Router } from "express";

import {
  loginRouter,
  userRouter,
  faqRouter,
  censusRouter,
} from "./http-routes";

export function setRoutes(app: Express): void {
  const router = Router();

  router.use("/user", userRouter());
  router.use("/login", loginRouter());
  router.use("/faq", faqRouter());
  router.use("/census", censusRouter());

  app.get("/_health", (req, res) => {
    res.status(200).json({ status: "good" });
  });

  app.use("/api/v1", router);
}
