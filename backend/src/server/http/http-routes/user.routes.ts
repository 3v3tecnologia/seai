import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";

import {
  userWriteAccessAuth,
  userReadAccessAuth,
  authorization,
} from "../http-middlewares";
import { UserControllersFactory } from "../factories/controllers";

export const userRouter = (): Router => {
  const router = Router();
  // criar novo usuário
  router.post(
    "/register",
    authorization,
    userWriteAccessAuth,
    adaptRoute(UserControllersFactory.makeCreateUser())
  );

  router.put(
    "/profile",
    authorization,
    adaptRoute(UserControllersFactory.makeUpdateUser())
  );

  router.put(
    "/:id",
    authorization,
    userWriteAccessAuth,
    adaptRoute(UserControllersFactory.makeUpdateUser())
  );

  router.delete(
    "/delete",
    authorization,
    userWriteAccessAuth,
    adaptRoute(UserControllersFactory.makeDeleteUser())
  );

  router.get(
    "/get/:id",
    authorization,
    userReadAccessAuth,
    adaptRoute(UserControllersFactory.makeGetUsers())
  );

  router.get(
    "/list",
    authorization,
    userReadAccessAuth,
    adaptRoute(UserControllersFactory.makeGetUsers())
  );

  router.get(
    "/profile",
    authorization,
    adaptRoute(UserControllersFactory.makeFetchUserById())
  );

  // router.get(
  //   "/:id",
  //   authorization,
  //   userWriteAccessAuth,
  //   adaptRoute(makeFetchUserByIdController())
  // );

  return router;
};
