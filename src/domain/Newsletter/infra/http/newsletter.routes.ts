import { Router } from "express";
import { adaptHTTPHandler } from "../../../../server/http/adapters/express-route.adapter";

import {
  authorization,
  newsletterPermissions,
} from "../../../../server/http/http-middlewares";
import { NewsletterController } from "../../controllers/newsletter.controller";

export const newsRouter = (): Router => {
  const router = Router()

  router.get(
    "/subscribers/email",
    authorization,
    adaptHTTPHandler(
      NewsletterController.getSubscribers
    )
  );

  router.post(
    "/",
    authorization,
    newsletterPermissions.write,
    adaptHTTPHandler(NewsletterController.create)
  );

  router.put(
    "/:id",
    authorization,
    newsletterPermissions.write,
    adaptHTTPHandler(NewsletterController.update)
  );

  router.delete(
    "/:id",
    authorization,
    newsletterPermissions.write,
    adaptHTTPHandler(NewsletterController.delete)
  );

  router.patch(
    "/:date",
    // authorization,
    adaptHTTPHandler(NewsletterController.updateSendAt)
  );

  router.get(
    "/sent",
    // authorization,
    // newsReadAccessAuth,
    adaptHTTPHandler(NewsletterController.getOnlySent)
  );

  router.get(
    "/previews/:date",
    // authorization,
    // newsReadAccessAuth,
    adaptHTTPHandler(NewsletterController.getUnsent)
  );

  router.get(
    "/:id",
    // authorization,
    // newsReadAccessAuth,
    adaptHTTPHandler(NewsletterController.getById)
  );

  router.get(
    "/",
    authorization,
    newsletterPermissions.read,
    adaptHTTPHandler(NewsletterController.getAll)
  );

  return router;
};
