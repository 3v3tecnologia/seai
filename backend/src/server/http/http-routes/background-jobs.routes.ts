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
import {
  authorization,
  jobsReadAccessAuth,
  jobsWriteAccessAuth,
} from "../http-middlewares";

export const backgroundJobsRouter = (): Router => {
  const router = Router();
  router.post(
    "/",
    authorization,
    jobsWriteAccessAuth,
    adaptRoute(makeCreateJobController())
  );
  router.put(
    "/",
    authorization,
    jobsWriteAccessAuth,
    adaptRoute(makeUpdateJobController())
  );
  router.delete(
    "/",
    authorization,
    jobsWriteAccessAuth,
    adaptRoute(makeDeleteJobController())
  );
  router.get(
    "/states",
    authorization,
    jobsReadAccessAuth,
    adaptRoute(makeFetchJobsStatesController())
  );
  router.get(
    "/",
    authorization,
    jobsReadAccessAuth,
    adaptRoute(makeFetchJobsController())
  );
  //CRON
  router.get(
    "/schedule",
    authorization,
    jobsReadAccessAuth,
    adaptRoute(makeFetchCronController())
  );
  router.post(
    "/schedule",
    authorization,
    jobsWriteAccessAuth,
    adaptRoute(makeCreateCronController())
  );
  router.put(
    "/schedule",
    authorization,
    jobsWriteAccessAuth,
    adaptRoute(makeUpdateCronController())
  );
  router.delete(
    "/schedule",
    authorization,
    jobsWriteAccessAuth,
    adaptRoute(makeDeleteCronController())
  );

  return router;
};
