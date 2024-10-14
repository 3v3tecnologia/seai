import { Router } from "express";
import { adaptHTTPHandler } from "../../../../server/http/adapters/express-route.adapter";
import { AuthenticationController } from "../../controllers/auth.controller";


export const setupAuthenticationRoutes = (): Router => {
  const router = Router();

  router.post(
    "/",
    adaptHTTPHandler(AuthenticationController.signIn)
  );
  return router
};
