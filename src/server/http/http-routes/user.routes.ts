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
    "/",
    authorization,
    userWriteAccessAuth,
    adaptRoute(UserControllersFactory.makeCreateUser())
  );

  router.patch(
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

  router.patch(
    "/complete-registration/:code",
    adaptRoute(UserControllersFactory.makeCompleteUserRegister())
  );

  router.post(
    "/password/reset/:code",
    adaptRoute(UserControllersFactory.makeResetUser())
  );

  router.post(
    "/password/forgot",
    adaptRoute(UserControllersFactory.makeForgotPassword())
  );

  router.post(
    "/sign-up",
    authorization,
    adaptRoute(UserControllersFactory.makeSignUp())
  );

  router.post("/sign-in", adaptRoute(UserControllersFactory.makeSignIn()));

  return router;
};
