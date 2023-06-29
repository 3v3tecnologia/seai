import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";
import { makeCreateUserController } from "../factories";

import { adminAuth, authorization } from "../http-middlewares";
import { makeGetUsersController } from "../factories/controllers/fetch-user.controller-factory";
import { makeDeleteUserController } from "../factories/controllers/delete-user-by-id.controller-factory";
import { makeGetUserAccessModulesController } from "../factories/controllers/load-users-access-modules-factory";

export const userRouter = (router: Router): Router => {
  // criar novo usuário
  router.post(
    "/register",
    authorization,
    adminAuth,
    adaptRoute(makeCreateUserController())
  );

  // continuar o cadastro de usuário
  router.post("/register/new-user", adaptRoute(makeCreateUserController()));

  router.put(
    "/update/:id",
    authorization,
    adaptRoute(makeDeleteUserController())
  );

  router.delete(
    "/delete",
    authorization,
    adminAuth,
    adaptRoute(makeCreateUserController())
  );

  router.get("/get/:id", authorization, adaptRoute(makeCreateUserController()));

  router.get(
    "/list",
    authorization,
    adminAuth,
    adaptRoute(makeGetUsersController())
  );

  router.get(
    "/list-user-access/:id",
    authorization,
    adminAuth,
    adaptRoute(makeGetUserAccessModulesController())
  );

  return router;
};
