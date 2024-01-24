import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";

import {
  userWriteAccessAuth,
  userReadAccessAuth,
  authorization,
  newsReadAccessAuth,
} from "../http-middlewares";

import {
  makeCreateNewsletter,
  makeDeleteNewsletterController,
  makeFetchAllNewsletterController,
  makeFetchByIdNewsletterController,
  makeUpdateNewsletterController,
  makeCreateNewsletterSubscriberController,
  makeDeleteNewsletterSubscriberController,
  makeFetchNewsletterSubscribersController,
} from "../factories/controllers/newsletter";
import { newsWriteAccessAuth } from "../http-middlewares/news-write";

export const newsRouter = (): Router => {
  const router = Router();

  router.post(
    "/",
    authorization,
    newsWriteAccessAuth,
    adaptRoute(makeCreateNewsletter())
  );

  router.put(
    "/:id",
    authorization,
    newsWriteAccessAuth,
    adaptRoute(makeUpdateNewsletterController())
  );

  router.delete(
    "/:id",
    authorization,
    newsWriteAccessAuth,
    adaptRoute(makeDeleteNewsletterController())
  );

  router.get(
    "/:id",
    authorization,
    newsReadAccessAuth,
    adaptRoute(makeFetchByIdNewsletterController())
  );

  router.get(
    "/",
    authorization,
    newsReadAccessAuth,
    adaptRoute(makeFetchAllNewsletterController())
  );

  router.post(
    "/subscribe",
    authorization,
    adaptRoute(makeCreateNewsletterSubscriberController())
  );

  router.delete(
    "/unsubscribe",
    authorization,
    adaptRoute(makeDeleteNewsletterSubscriberController())
  );

  router.get(
    "/subscribers",
    authorization,
    adaptRoute(makeFetchNewsletterSubscribersController())
  );

  return router;
};
