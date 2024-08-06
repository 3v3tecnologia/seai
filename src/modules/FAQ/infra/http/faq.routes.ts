import { Router } from "express";
import { adaptRoute } from "../../../../server/http/adapters/express-route.adapter";

import {
  authorization,
  FAQPermissions,
} from "../../../../server/http/http-middlewares";
import { FaqControllersFactory } from "../../controllers";

export const faqRouter = (): Router => {
  const router = Router();

  router.get(
    "/categories",
    // authorization,
    adaptRoute(FaqControllersFactory.makeFetchFaqCategories())
  );

  router.put(
    "/categories/:id",
    authorization,
    FAQPermissions.write,
    adaptRoute(FaqControllersFactory.makeUpdateFaqCategory())
  );

  router.post(
    "/categories",
    authorization,
    FAQPermissions.write,
    adaptRoute(FaqControllersFactory.makeCreateFaqCategory())
  );

  router.delete(
    "/categories/:id",
    authorization,
    FAQPermissions.read,
    adaptRoute(FaqControllersFactory.makeDeleteFaqCategory())
  );

  router.get(
    "/",
    // authorization,
    adaptRoute(FaqControllersFactory.makeFetchFaqsWithCategory())
  );

  router.get(
    "/:id",
    // authorization,
    adaptRoute(FaqControllersFactory.makeFetchFaqById())
  );

  router.post(
    "/",
    authorization,
    FAQPermissions.write,
    adaptRoute(FaqControllersFactory.makeCreateFaq())
  );

  router.put(
    "/:id",
    authorization,
    FAQPermissions.write,
    adaptRoute(FaqControllersFactory.makeUpdateFaq())
  );

  router.delete(
    "/:id",
    authorization,
    FAQPermissions.write,
    adaptRoute(FaqControllersFactory.makeDeleteFaq())
  );

  return router;
};
