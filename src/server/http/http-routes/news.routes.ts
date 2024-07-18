import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";

import {
  authorization,
  needNewsletterReadPermission,
  needNewsletterWritePermission,
} from "../http-middlewares";

import { NewsletterControllersFactory } from "../factories/controllers";

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
    "/subscribers",
    authorization,
    adaptRoute(NewsletterControllersFactory.makeFetchNewsletterSubscribers())
  );

  router.get(
    "/subscribers/email",
    authorization,
    adaptRoute(
      NewsletterControllersFactory.makeFetchNewsletterSubscribersEmails()
    )
  );

  router.post(
    "/",
    authorization,
    needNewsletterWritePermission,
    adaptRoute(NewsletterControllersFactory.makeCreateNewsletter())
  );

  router.patch(
    "/:id",
    // authorization,
    adaptRoute(NewsletterControllersFactory.makeUpdateSendAt())
  );

  router.put(
    "/:id",
    authorization,
    needNewsletterWritePermission,
    adaptRoute(NewsletterControllersFactory.makeUpdateNewsletter())
  );

  router.delete(
    "/:id",
    authorization,
    needNewsletterWritePermission,
    adaptRoute(NewsletterControllersFactory.makeDeleteNewsletter())
  );

  router.get(
    "/sent",
    // authorization,
    // newsReadAccessAuth,
    adaptRoute(NewsletterControllersFactory.makeFetchOnlySentNewsletter())
  );

  router.get(
    "/:id",
    // authorization,
    // newsReadAccessAuth,
    adaptRoute(NewsletterControllersFactory.makeFetchByIdNewsletter())
  );

  router.get(
    "/",
    authorization,
    needNewsletterReadPermission,
    adaptRoute(NewsletterControllersFactory.makeFetchAllNewsletter())
  );

  return router;
};
