import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";

import { authorization, newsReadAccessAuth } from "../http-middlewares";

import {
  makeFetchAccessKeyByIdController,
  makeRegisterAccessKeyController,
  makeUpdateAccessKeyController,
} from "../factories/controllers/access-key";

import { newsWriteAccessAuth } from "../http-middlewares/news-write";

export const accessKeyRouter = (): Router => {
  const router = Router();

  router.put(
    "/:id",
    authorization,
    newsWriteAccessAuth,
    adaptRoute(makeUpdateAccessKeyController())
  );

  router.get(
    "/:id",
    authorization,
    adaptRoute(makeFetchAccessKeyByIdController())
  );

  router.post(
    "/",
    authorization,
    adaptRoute(makeRegisterAccessKeyController())
  );

  return router;
};
