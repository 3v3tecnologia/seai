import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";

import {
  authorization,
  registerManagerWriteAccessAuth,
} from "../http-middlewares";

import {
  makeFetchFaqByCategoryController,
  makeFetchFaqCategoriesController,
} from "../factories/controllers/faq";
import { makeCreateFaqCategoryController } from "../factories/controllers/faq/create-category-controller-factory";
import { makeCreateFaqController } from "../factories/controllers/faq/create-faq-controller-factory";
import { makeUpdateFaqController } from "../factories/controllers/faq/update-faq-controller-factory";
import { makeDeleteFaqController } from "../factories/controllers/faq/delete-faq-controller-factory";
import { makeDeleteFaqCategoryController } from "../factories/controllers/faq/delete-faq-category-controller-factory";

export const faqRouter = (): Router => {
  const router = Router();
  router.post(
    "/create",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(makeCreateFaqController())
  );
  router.post(
    "/category/create",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(makeCreateFaqCategoryController())
  );
  router.delete(
    "/category/delete",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(makeDeleteFaqCategoryController())
  );
  router.put(
    "/update",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(makeUpdateFaqController())
  );
  router.delete(
    "/delete",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(makeDeleteFaqController())
  );
  router.get(
    "/categories/list",
    authorization,
    adaptRoute(makeFetchFaqCategoriesController())
  );
  router.get(
    "/list",
    authorization,
    adaptRoute(makeFetchFaqByCategoryController())
  );
  return router;
};
