import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";

import {
  authorization,
  registerManagerWriteAccessAuth,
} from "../http-middlewares";
import { FaqControllersFactory } from "../factories/controllers";

const setupCategoryRoutes = (router: Router): void => {
  router.get(
    "/category",
    authorization,
    adaptRoute(FaqControllersFactory.makeFetchFaqCategories())
  );

  router.put(
    "/category",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(FaqControllersFactory.makeUpdateFaqCategory())
  );

  router.post(
    "/category",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(FaqControllersFactory.makeCreateFaqCategory())
  );

  router.delete(
    "/category/:id",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(FaqControllersFactory.makeDeleteFaqCategory())
  );
}

const setupFaqRoutes = (router: Router): void => {
  router.get(
    "/by-categories",
    authorization,
    adaptRoute(FaqControllersFactory.makeFetchFaqByCategory())
  );

  router.get(
    "/by-category/:id",
    authorization,
    adaptRoute(FaqControllersFactory.makeFetchFaqByCategory())
  );

  router.get(
    "/",
    authorization,
    adaptRoute(FaqControllersFactory.makeFetchFaqsWithCategory())
  );

  router.get(
    "/:id",
    authorization,
    adaptRoute(FaqControllersFactory.makeFetchFaqById())
  );


  router.post(
    "/",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(FaqControllersFactory.makeCreateFaq())
  );

  router.put(
    "/",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(FaqControllersFactory.makeUpdateFaq())
  );

  router.delete(
    "/:id",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(FaqControllersFactory.makeDeleteFaq())
  );

};

const faqRouter = Router();

setupFaqRoutes(faqRouter)
setupCategoryRoutes(faqRouter)

export { faqRouter }