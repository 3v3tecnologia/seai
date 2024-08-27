import { Router } from "express";
import { makeGovernmentUserController } from "../../controllers";
import {
  authorization,
  userPermissions,
} from "../../../../../server/http/http-middlewares";

// import { setupUserIrrigantAccountRoutes } from "../../../Irrigant/infra/http/irrigation-user.routes";
import { adaptHTTPHandler } from "../../../../../server/http/adapters/express-route.adapter";

export const userRouter = (): Router => {
  const router = Router();

  // setupUserIrrigantAccountRoutes(router);

  const controllers = makeGovernmentUserController();

  router.get(
    "/system/modules",
    authorization,
    userPermissions.read,
    adaptHTTPHandler(controllers.getProfile.bind(controllers))
  );

  router.get(
    "/profile",
    authorization,
    adaptHTTPHandler(controllers.getUserById.bind(controllers))
  );

  router.delete(
    "/profile",
    authorization,
    adaptHTTPHandler(controllers.deleteUser.bind(controllers))
  );

  router.patch(
    "/profile",
    authorization,
    adaptHTTPHandler(controllers.updateProfile.bind(controllers))
  );

  router.post(
    "/",
    authorization,
    userPermissions.write,
    adaptHTTPHandler(controllers.create.bind(controllers))
  );

  router.patch(
    "/:id",
    authorization,
    userPermissions.write,
    adaptHTTPHandler(controllers.updateUser.bind(controllers))
  );

  router.get(
    "/",
    authorization,
    userPermissions.read,
    adaptHTTPHandler(controllers.getUsers.bind(controllers))
  );

  router.get(
    "/:id",
    authorization,
    userPermissions.read,
    adaptHTTPHandler(controllers.getUserById.bind(controllers))
  );

  router.delete(
    "/:id",
    authorization,
    userPermissions.write,
    adaptHTTPHandler(controllers.deleteUser.bind(controllers))
  );

  // Delete by email
  router.delete(
    "/",
    authorization,
    adaptHTTPHandler(controllers.deleteUser.bind(controllers))
  );

  router.post(
    "/sign-in",
    adaptHTTPHandler(controllers.login.bind(controllers))
  );

  router.patch(
    "/complete-registration/:code",
    adaptHTTPHandler(controllers.completeRegister.bind(controllers))
  );

  router.post(
    "/password/reset/:code",
    adaptHTTPHandler(controllers.resetPassword.bind(controllers))
  );

  router.post(
    "/password/forgot",
    adaptHTTPHandler(controllers.forgotPassword.bind(controllers))
  );

  return router;
};
