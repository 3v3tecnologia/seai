import { Router } from "express";
import { adaptHTTPHandler } from "../../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../../server/http/http-middlewares";
import { UserOperationsController } from "../../controller/user-operations.controller";
import { adaptMiddleware } from "../../../../server/http/adapters/express-middleware-adapter";
import { makeAdminMiddleware } from "../../../../server/http/factories/middlewares/admin.middleware.factory";

export const userOperationsRouter = (): Router => {
  const router = Router();

  router.get(
    "/",
    authorization,
    adaptMiddleware(makeAdminMiddleware()),
    adaptHTTPHandler(UserOperationsController.getAll)
  );

  return router;
};
