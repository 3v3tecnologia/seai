import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";
import {
  makeForgotPasswordController,
  makeResetUserController,
  makeSignInController,
  makeSignUpController,
} from "../factories/controllers/user";

export const loginRouter = (): Router => {
  const router = Router();
  router.post("/password/reset", adaptRoute(makeResetUserController()));
  router.post("/password/forgot", adaptRoute(makeForgotPasswordController()));
  router.post("/sign-up", adaptRoute(makeSignUpController()));
  router.post("/sign-in", adaptRoute(makeSignInController()));
  return router;
};
