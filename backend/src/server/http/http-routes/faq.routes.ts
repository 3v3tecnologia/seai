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
import { makeDeleteFaqCategoryController } from "../factories/controllers/faq/delete-faq-category-controller-factory";
import { makeDeleteFaqController } from "../factories/controllers/faq/delete-faq-controller-factory";
import { makeFetchFaqByIdController } from "../factories/controllers/faq/fetch-faq-by-id-controller-factory";
import { makeFetchFaqsWithCategoryController } from "../factories/controllers/faq/fetch-faq-with-category-controller-factory";
import { makeUpdateFaqCategoryController } from "../factories/controllers/faq/update-faq-category-controller-factory";
import { makeUpdateFaqController } from "../factories/controllers/faq/update-faq-controller-factory";

export const faqRouter = (): Router => {
  const router = Router();
  router.post(
    "/create",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(makeCreateFaqController())
  );
  router.put(
    "/update",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(makeUpdateFaqController())
  );
  router.delete(
    "/delete/:id",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(makeDeleteFaqController())
  );

  router.get(
    "/list-by-categories",
    authorization,
    adaptRoute(makeFetchFaqByCategoryController())
  );
  router.get(
    "/list-by-category/:id",
    authorization,
    adaptRoute(makeFetchFaqByCategoryController())
  );
  router.get(
    "/list",
    authorization,
    adaptRoute(makeFetchFaqsWithCategoryController())
  );
  router.get(
    "/get/:id",
    authorization,
    adaptRoute(makeFetchFaqByIdController())
  );
  router.get(
    "/category/list",
    authorization,
    adaptRoute(makeFetchFaqCategoriesController())
  );
  router.put(
    "/category/update",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(makeUpdateFaqCategoryController())
  );
  router.post(
    "/category/create",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(makeCreateFaqCategoryController())
  );
  router.delete(
    "/category/delete/:id",
    authorization,
    registerManagerWriteAccessAuth,
    adaptRoute(makeDeleteFaqCategoryController())
  );

  return router;
};
