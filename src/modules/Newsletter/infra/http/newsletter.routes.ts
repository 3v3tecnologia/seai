import { Router } from "express";
import { adaptRoute } from "../../../../server/http/adapters/express-route.adapter";

import {
  authorization,
  newsletterPermissions,
} from "../../../../server/http/http-middlewares";
import { NewsletterControllersFactory } from "../../controllers/factory/newsletter.controller.factory";

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

  router.patch(
    "/confirm-subscription/:code",
    adaptRoute(NewsletterControllersFactory.makeConfirmSubscriberByCode())
  );

  router.delete(
    "/unsubscribe/:code",
    adaptRoute(NewsletterControllersFactory.makeConfirmUnsubscribeByCode())
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
    newsletterPermissions.write,
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
    newsletterPermissions.write,
    adaptRoute(NewsletterControllersFactory.makeUpdateNewsletter())
  );

  router.delete(
    "/:id",
    authorization,
    newsletterPermissions.write,
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
    newsletterPermissions.read,
    adaptRoute(NewsletterControllersFactory.makeFetchAllNewsletter())
  );

  return router;
};