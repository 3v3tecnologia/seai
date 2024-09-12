import { Router } from "express";
import { adaptHTTPHandler } from "../../../../server/http/adapters/express-route.adapter";
import { IrrigantUserController } from "../../controllers/irrigant-user.controller";
import { authorization } from "../../../../server/http/http-middlewares";

export const irrigationUserRoutes = (router: Router): void => {
  router.post("/", adaptHTTPHandler(IrrigantUserController.create));

  router.get(
    "/",
    authorization,
    adaptHTTPHandler(IrrigantUserController.getProfile)
  );

  router.delete(
    "/",
    authorization,
    adaptHTTPHandler(IrrigantUserController.deleteAccount)
  );

  router.patch(
    "/",
    authorization,
    adaptHTTPHandler(IrrigantUserController.updateProfile)
  );

  router.post("/login", adaptHTTPHandler(IrrigantUserController.login));

  router.patch(
    "/reset-password/:code",
    adaptHTTPHandler(IrrigantUserController.resetPassword)
  );

  router.patch(
    "/activate/:code",
    adaptHTTPHandler(IrrigantUserController.completeRegister)
  );

  router.post(
    "/forgot-password",
    adaptHTTPHandler(IrrigantUserController.forgotPassword)
  );
};
