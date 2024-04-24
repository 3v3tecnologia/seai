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
    "/profile/:id",
    authorization,
    adaptRoute(UserControllersFactory.makeUpdateUserProfile())
  );

  // Update user account
  router.put(
    "/:id",
    authorization,
    userWriteAccessAuth,
    adaptRoute(UserControllersFactory.makeUpdateUser())
  );

  // Complete user account register
  router.put(
    "/complete-register",
    authorization,
    userWriteAccessAuth,
    adaptRoute(UserControllersFactory.makeCompleteUserRegister())
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
