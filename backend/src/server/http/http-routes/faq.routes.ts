import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";

import {
  authorization,
  registerManagerWriteAccessAuth,
} from "../http-middlewares";
import { FaqControllersFactory } from "../factories/controllers";

export const faqRouter = (): Router => {
  const router = Router();
  router.post(
    "/create",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(FaqControllersFactory.makeCreateFaq())
  );
  router.put(
    "/update",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(FaqControllersFactory.makeUpdateFaq())
  );
  router.delete(
    "/delete/:id",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(FaqControllersFactory.makeDeleteFaq())
  );

  router.get(
    "/list-by-categories",
    authorization,
    adaptRoute(FaqControllersFactory.makeFetchFaqByCategory())
  );
  router.get(
    "/list-by-category/:id",
    authorization,
    adaptRoute(FaqControllersFactory.makeFetchFaqByCategory())
  );
  router.get(
    "/list",
    authorization,
    adaptRoute(FaqControllersFactory.makeFetchFaqsWithCategory())
  );
  router.get(
    "/get/:id",
    authorization,
    adaptRoute(FaqControllersFactory.makeFetchFaqById())
  );
  router.get(
    "/category/list",
    authorization,
    adaptRoute(FaqControllersFactory.makeFetchFaqCategories())
  );
  router.put(
    "/category/update",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(FaqControllersFactory.makeUpdateFaqCategory())
  );
  router.post(
    "/category/create",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(FaqControllersFactory.makeCreateFaqCategory())
  );
  router.delete(
    "/category/delete/:id",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(FaqControllersFactory.makeDeleteFaqCategory())
  );

  return router;
};
