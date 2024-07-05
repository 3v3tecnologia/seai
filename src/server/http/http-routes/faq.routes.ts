import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";

import { authorization } from "../http-middlewares";
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
    adaptRoute(FaqControllersFactory.makeUpdateFaqCategory())
  );

  router.post(
    "/categories",
    authorization,
    adaptRoute(FaqControllersFactory.makeCreateFaqCategory())
  );

  router.delete(
    "/categories/:id",
    authorization,
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
    adaptRoute(FaqControllersFactory.makeCreateFaq())
  );

  router.put(
    "/:id",
    authorization,
    adaptRoute(FaqControllersFactory.makeUpdateFaq())
  );

  router.delete(
    "/:id",
    authorization,
    adaptRoute(FaqControllersFactory.makeDeleteFaq())
  );
};

const faqRouter = Router();

setupFaqRoutes(faqRouter);

export { faqRouter };
