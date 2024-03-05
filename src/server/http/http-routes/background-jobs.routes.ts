import { Router } from "express";

import { adaptRoute } from "../adapters/express-route.adapter";

import { BackgroundJobsControllerFactory } from "../factories/controllers";

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
    adaptRoute(BackgroundJobsControllerFactory.makeCreateJob())
  );
  router.put(
    "/",
    authorization,
    jobsWriteAccessAuth,
    adaptRoute(BackgroundJobsControllerFactory.makeUpdateJob())
  );
  router.delete(
    "/",
    authorization,
    jobsWriteAccessAuth,
    adaptRoute(BackgroundJobsControllerFactory.makeDeleteJob())
  );
  router.get(
    "/states",
    authorization,
    jobsReadAccessAuth,
    adaptRoute(BackgroundJobsControllerFactory.makeFetchJobsStates())
  );
  router.get(
    "/",
    authorization,
    jobsReadAccessAuth,
    adaptRoute(BackgroundJobsControllerFactory.makeFetchJobs())
  );
  //CRON
  router.get(
    "/schedule",
    authorization,
    jobsReadAccessAuth,
    adaptRoute(BackgroundJobsControllerFactory.makeFetchCron())
  );
  router.post(
    "/schedule",
    authorization,
    jobsWriteAccessAuth,
    adaptRoute(BackgroundJobsControllerFactory.makeCreateCron())
  );
  router.put(
    "/schedule",
    authorization,
    jobsWriteAccessAuth,
    adaptRoute(BackgroundJobsControllerFactory.makeUpdateCron())
  );
  router.delete(
    "/schedule",
    authorization,
    jobsWriteAccessAuth,
    adaptRoute(BackgroundJobsControllerFactory.makeDeleteCron())
  );

  return router;
};
