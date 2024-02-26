import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";

import { authorization, newsReadAccessAuth } from "../http-middlewares";

import { NewsletterControllersFactory } from "../factories/controllers";
import { newsWriteAccessAuth } from "../http-middlewares/news-write";

export const newsRouter = (): Router => {
  const router = Router();

  router.post(
    "/enroll",
    authorization,
    adaptRoute(NewsletterControllersFactory.makeCreateNewsletterSubscriber())
  );

  router.delete(
    "/unregister",
    authorization,
    adaptRoute(NewsletterControllersFactory.makeDeleteNewsletterSubscriber())
  );

  router.get(
    "/registered/list",
    authorization,
    adaptRoute(NewsletterControllersFactory.makeFetchNewsletterSubscribers())
  );

  router.post(
    "/",
    authorization,
    newsWriteAccessAuth,
    adaptRoute(NewsletterControllersFactory.makeCreateNewsletter())
  );

  router.put(
    "/:id",
    authorization,
    newsWriteAccessAuth,
    adaptRoute(NewsletterControllersFactory.makeUpdateNewsletter())
  );

  router.delete(
    "/:id",
    authorization,
    newsWriteAccessAuth,
    adaptRoute(NewsletterControllersFactory.makeDeleteNewsletter())
  );

  router.get(
    "/:id",
    authorization,
    newsReadAccessAuth,
    adaptRoute(NewsletterControllersFactory.makeFetchByIdNewsletter())
  );

  router.get(
    "/",
    authorization,
    newsReadAccessAuth,
    adaptRoute(NewsletterControllersFactory.makeFetchAllNewsletter())
  );

  return router;
};
