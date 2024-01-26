import { Express, Router } from "express";

import {
  loginRouter,
  userRouter,
  faqRouter,
  censusRouter,
  equipmentsRouter,
  newsRouter,
  backgroundJobsRouter,
  accessKeyRouter,
} from "./http-routes";

export function setRoutes(app: Express): void {
  const router = Router();

  router.use("/user", userRouter());
  router.use("/login", loginRouter());
  router.use("/faq", faqRouter());
  router.use("/census", censusRouter());
  router.use("/equipments", equipmentsRouter());
  router.use("/news", newsRouter());
  router.use("/jobs", backgroundJobsRouter());
  router.use("/accessKey", accessKeyRouter());

  app.get("/_health", (req, res) => {
    res.status(200).json({ status: "good" });
  });

  app.use("/api/v1", router);

  app.use("*", (req, res) => {
    res.status(404).json({
      error: ":[ Ops ! recurso não encontrado, verifique a URL informada.",
    });
  });
}
