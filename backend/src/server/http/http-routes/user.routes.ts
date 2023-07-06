import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetUserAccessModulesController,
  makeGetUsersController,
} from "../factories/controllers/user";

import {
  userWriteAccessAuth,
  userReadAccessAuth,
  authorization,
} from "../http-middlewares";

export const userRouter = (): Router => {
  const router = Router();
  // criar novo usuário
  router.post(
    "/register",
    authorization,
    userWriteAccessAuth,
    adaptRoute(makeCreateUserController())
  );

  router.put(
    "/update/:id",
    authorization,
    userWriteAccessAuth,
    adaptRoute(makeDeleteUserController())
  );

  router.delete(
    "/delete/:id",
    authorization,
    userWriteAccessAuth,
    adaptRoute(makeDeleteUserController())
  );

  router.get(
    "/get/:id",
    authorization,
    userReadAccessAuth,
    adaptRoute(makeCreateUserController())
  );

  router.get(
    "/list",
    authorization,
    userReadAccessAuth,
    adaptRoute(makeGetUsersController())
  );

  router.get(
    "/list-user-access/:id",
    authorization,
    userWriteAccessAuth,
    adaptRoute(makeGetUserAccessModulesController())
  );

  return router;
};
