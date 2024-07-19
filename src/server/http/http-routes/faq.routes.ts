import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";

import { authorization, FAQPermissions } from "../http-middlewares";
import { FaqControllersFactory } from "../factories/controllers";

const setupFaqRoutes = (router: Router): void => {
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
};

const faqRouter = Router();

setupFaqRoutes(faqRouter);

export { faqRouter };
