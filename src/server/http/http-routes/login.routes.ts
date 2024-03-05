import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";

import { authorization } from "../http-middlewares";
import { UserControllersFactory } from "../factories/controllers";

export const loginRouter = (): Router => {
  const router = Router();
  router.post(
    "/password/reset",
    authorization,
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
