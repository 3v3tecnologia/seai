import { Router } from "express";
import { authorization, userPermissions } from "../../../../server/http/http-middlewares";
import { GovernmentUserController } from "../../controllers/gov-user.controller";
import { adaptHTTPHandler } from "../../../../server/http/adapters/express-route.adapter";


export const userRouter = (router: Router): void => {

  router.get(
    "/system/modules",
    authorization,
    userPermissions.read,
    adaptHTTPHandler(GovernmentUserController.getProfile)
  );

  router.get(
    "/profile",
    authorization,
    adaptHTTPHandler(GovernmentUserController.getUserById)
  );

  router.delete(
    "/profile",
    authorization,
    adaptHTTPHandler(GovernmentUserController.deleteUser)
  );

  router.patch(
    "/profile",
    authorization,
    adaptHTTPHandler(GovernmentUserController.updateProfile)
  );

  router.post(
    "/",
    authorization,
    userPermissions.write,
    adaptHTTPHandler(GovernmentUserController.create)
  );

  router.patch(
    "/:id",
    authorization,
    userPermissions.write,
    adaptHTTPHandler(GovernmentUserController.updateUser)
  );

  router.get(
    "/",
    authorization,
    userPermissions.read,
    adaptHTTPHandler(GovernmentUserController.getUsers)
  );

  router.get(
    "/:id",
    authorization,
    userPermissions.read,
    adaptHTTPHandler(GovernmentUserController.getUserById)
  );

  router.delete(
    "/:id",
    authorization,
    userPermissions.write,
    adaptHTTPHandler(GovernmentUserController.deleteUser)
  );

  // Delete by email
  router.delete(
    "/",
    authorization,
    adaptHTTPHandler(GovernmentUserController.deleteUser)
  );

  router.post(
    "/sign-in",
    adaptHTTPHandler(GovernmentUserController.login)
  );

  router.patch(
    "/complete-registration/:code",
    adaptHTTPHandler(GovernmentUserController.completeRegister)
  );

  router.post(
    "/password/reset/:code",
    adaptHTTPHandler(GovernmentUserController.resetPassword)
  );

  router.post(
    "/password/forgot",
    adaptHTTPHandler(GovernmentUserController.forgotPassword)
  );

};
