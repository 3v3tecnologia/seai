import { Router } from "express";
import { adaptHTTPHandler } from "../../../../server/http/adapters/express-route.adapter";
import { IrrigantUserController } from "../../controllers/irrigant-user.controller";
import { authorization } from "../../../../server/http/http-middlewares";

export const setupIrrigationUser = (): Router => {
  const router = Router();

  router.post("/", adaptHTTPHandler(IrrigantUserController.create));

  router.use("/sign-in", adaptHTTPHandler(IrrigantUserController.login));

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

  return router
};
