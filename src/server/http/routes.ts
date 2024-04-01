import { Express, Router } from "express";

import {
  accessKeyRouter,
  backgroundJobsRouter,
  censusRouter,
  equipmentsRouter,
  faqRouter,
  loginRouter,
  newsRouter,
  userRouter,
  managementRouter,
} from "./http-routes";
import { managementRoutes } from "../../v2/management/routes/routes";

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
  app.use("/api/v2/management", managementRoutes());

  app.use("*", (req, res) => {
    res.status(404).json({
      error: ":[ Ops ! recurso não encontrado, verifique a URL informada.",
    });
  });
}
