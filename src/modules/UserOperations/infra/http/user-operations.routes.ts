import { Request, Router } from "express";
import { UserOperationsController } from "../../controller/user-operations.controller";
import { GetAllInput } from "../../controller/schema/request";
import { authorization } from "../../../../server/http/http-middlewares";
import { sendHTTPResponse } from "../../../../server/http/adapters/express-route.adapter";

export const userOperationsRouter = (): Router => {
  const router = Router();

  router.get(
    "/",
    authorization,
    async (request: Request<any, any, any, GetAllInput, any>, response) => {
      sendHTTPResponse(
        await UserOperationsController.getAll(request.query),
        response
      );
    }
  );

  return router;
};
