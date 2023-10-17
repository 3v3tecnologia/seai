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
import { makeUpdateUserController } from "../factories/controllers/user/update-user.controller-factory";

export const userRouter = (): Router => {
  const router = Router();
  // criar novo usuário
  router.post(
    "/register",
    authorization,
    userWriteAccessAuth,
    adaptRoute(makeCreateUserController())
  );

  router.put("/profile", authorization, adaptRoute(makeUpdateUserController()));

  router.put(
    "/:id",
    authorization,
    userWriteAccessAuth,
    adaptRoute(makeUpdateUserController())
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
