import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";

import { authorization } from "../http-middlewares";

import { AccessKeyControllerFactory } from "../factories/controllers";

import { newsWriteAccessAuth } from "../http-middlewares/news-write";

export const accessKeyRouter = (): Router => {
  const router = Router();

  router.put(
    "/:id",
    authorization,
    newsWriteAccessAuth,
    adaptRoute(AccessKeyControllerFactory.makeUpdate())
  );

  router.get(
    "/:id",
    authorization,
    adaptRoute(AccessKeyControllerFactory.makeFetchAccessKeyById())
  );

  router.delete(
    "/:id",
    authorization,
    adaptRoute(AccessKeyControllerFactory.makeDelete())
  );

  router.get(
    "/",
    authorization,
    adaptRoute(AccessKeyControllerFactory.makeFetchAccessKeys())
  );

  router.post(
    "/",
    authorization,
    adaptRoute(AccessKeyControllerFactory.makeRegister())
  );

  return router;
};
