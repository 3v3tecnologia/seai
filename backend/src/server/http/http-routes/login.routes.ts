import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";
import { makeForgotPasswordController } from "../factories/controllers/forgot-password.controller-factory";
import { makeSignInController } from "../factories/controllers/sign-in.controller-factory";
import { makeSignUpController } from "../factories/controllers/sign-up.controller-factory";
import { makeResetUserController } from "../factories/controllers/reset-user-password.controller-factory";

export const loginRouter = (router: Router): Router => {
  router.post("/password/reset", adaptRoute(makeResetUserController()));
  router.post("/password/forgot", adaptRoute(makeForgotPasswordController()));
  router.post("/sign-up", adaptRoute(makeSignUpController()));
  router.post("/sign-in", adaptRoute(makeSignInController()));
  return router;
};
