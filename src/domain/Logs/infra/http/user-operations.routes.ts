import { Router } from "express";
import { adaptHTTPHandler } from "../../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../../server/http/http-middlewares";
import { UserOperationsController } from "../../controller/user-operations.controller";

export const userOperationsRouter = (): Router => {
  const router = Router();

  router.get(
    "/",
    authorization,
    adaptHTTPHandler(UserOperationsController.getAll)
  );

  return router;
};
