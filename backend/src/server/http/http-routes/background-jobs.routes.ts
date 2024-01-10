import { Router } from "express";

import { adaptRoute } from "../adapters/express-route.adapter";

import {
  makeCreateCronController,
  makeCreateJobController,
  makeDeleteCronController,
  makeDeleteJobController,
  makeFetchCronController,
  makeFetchJobsController,
  makeFetchJobsStatesController,
  makeUpdateCronController,
  makeUpdateJobController,
} from "../factories/controllers/jobs";
import { authorization } from "../http-middlewares";

export const backgroundJobsRouter = (): Router => {
  const router = Router();
  router.post("/", authorization, adaptRoute(makeCreateJobController()));
  router.put("/", authorization, adaptRoute(makeUpdateJobController()));
  router.delete("/", authorization, adaptRoute(makeDeleteJobController()));
  router.get(
    "/states",
    authorization,
    adaptRoute(makeFetchJobsStatesController())
  );
  router.get("/", authorization, adaptRoute(makeFetchJobsController()));
  //CRON
  router.get("/schedule", authorization, adaptRoute(makeFetchCronController()));
  router.post(
    "/schedule",
    authorization,
    adaptRoute(makeCreateCronController())
  );
  router.put(
    "/schedule",
    authorization,
    adaptRoute(makeUpdateCronController())
  );
  router.delete(
    "/schedule",
    authorization,
    adaptRoute(makeDeleteCronController())
  );

  return router;
};
