import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";

import {
  userWriteAccessAuth,
  userReadAccessAuth,
  authorization,
} from "../http-middlewares";

import {
  makeCreateNewsletter,
  makeDeleteNewsletterController,
  makeFetchAllNewsletterController,
  makeFetchByIdNewsletterController,
  makeUpdateNewsletterController,
} from "../factories/controllers/newsletter";

export const newsRouter = (): Router => {
  const router = Router();
  // criar novo usuário
  router.post(
    "/",
    authorization,
    userWriteAccessAuth,
    adaptRoute(makeCreateNewsletter())
  );

  router.put(
    "/:id",
    authorization,
    userWriteAccessAuth,
    adaptRoute(makeUpdateNewsletterController())
  );

  router.delete(
    "/:id",
    authorization,
    userWriteAccessAuth,
    adaptRoute(makeDeleteNewsletterController())
  );

  router.get(
    "/:id",
    authorization,
    userReadAccessAuth,
    adaptRoute(makeFetchByIdNewsletterController())
  );

  router.get(
    "/",
    authorization,
    userReadAccessAuth,
    adaptRoute(makeFetchAllNewsletterController())
  );

  return router;
};
