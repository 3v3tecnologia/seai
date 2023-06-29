import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";

import {
  authorization,
  registerManagerReadAccessAuth,
  registerManagerWriteAccessAuth,
} from "../http-middlewares";

import {
  makeFetchFaqCategoriesController,
  makeFetchFaqByCategoryController,
} from "../factories/controllers/faq";

export const faqRouter = (): Router => {
  const router = Router();
  router.post(
    "/create",
    authorization,
    registerManagerWriteAccessAuth,
    (req, res) => {
      return res.status(200).json({ message: "ok" });
    }
  );
  router.put(
    "/update",
    authorization,
    registerManagerWriteAccessAuth,
    (req, res) => {
      return res.status(200).json({ message: "ok" });
    }
  );
  router.delete(
    "/delete",
    authorization,
    registerManagerWriteAccessAuth,
    (req, res) => {
      return res.status(200).json({ message: "ok" });
    }
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
