import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";

import { authorization, userPermissions } from "../http-middlewares";
import { UserControllersFactory } from "../factories/controllers";
import { setupUserIrrigantAccountRoutes } from "../../../modules/irrigant/user/http/account";

export const userRouter = (): Router => {
  const router = Router();

  setupUserIrrigantAccountRoutes(router);

  router.get(
    "/system/modules",
    authorization,
    userPermissions.read,
    adaptRoute(UserControllersFactory.makeFetchSystemModules())
  );

  router.get(
    "/profile",
    authorization,
    adaptRoute(UserControllersFactory.makeFetchUserById())
  );

  router.delete(
    "/profile",
    authorization,
    adaptRoute(UserControllersFactory.makeDeleteUser())
  );

  router.patch(
    "/profile",
    authorization,
    adaptRoute(UserControllersFactory.makeUpdateUserProfile())
  );

  router.post(
    "/",
    authorization,
    userPermissions.write,
    adaptRoute(UserControllersFactory.makeCreateUser())
  );

  router.patch(
    "/:id",
    authorization,
    userPermissions.write,
    adaptRoute(UserControllersFactory.makeUpdateUser())
  );

  router.get(
    "/",
    authorization,
    userPermissions.read,
    adaptRoute(UserControllersFactory.makeGetUsers())
  );

  router.get(
    "/:id",
    authorization,
    userPermissions.read,
    adaptRoute(UserControllersFactory.makeFetchUserById())
  );

  router.delete(
    "/:id",
    authorization,
    userPermissions.write,
    adaptRoute(UserControllersFactory.makeDeleteUser())
  );

  // Delete by email
  router.delete(
    "/",
    authorization,
    adaptRoute(UserControllersFactory.makeDeleteUser())
  );

  router.post("/sign-in", adaptRoute(UserControllersFactory.makeSignIn()));

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

  return router;
};
