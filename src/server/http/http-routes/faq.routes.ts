import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";

import { authorization, needFAQWritePermission } from "../http-middlewares";
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
    needFAQWritePermission,
    adaptRoute(FaqControllersFactory.makeUpdateFaqCategory())
  );

  router.post(
    "/categories",
    authorization,
    needFAQWritePermission,
    adaptRoute(FaqControllersFactory.makeCreateFaqCategory())
  );

  router.delete(
    "/categories/:id",
    authorization,
    needFAQWritePermission,
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
    needFAQWritePermission,
    adaptRoute(FaqControllersFactory.makeCreateFaq())
  );

  router.put(
    "/:id",
    authorization,
    needFAQWritePermission,
    adaptRoute(FaqControllersFactory.makeUpdateFaq())
  );

  router.delete(
    "/:id",
    authorization,
    needFAQWritePermission,
    adaptRoute(FaqControllersFactory.makeDeleteFaq())
  );
};

const faqRouter = Router();

setupFaqRoutes(faqRouter);

export { faqRouter };
