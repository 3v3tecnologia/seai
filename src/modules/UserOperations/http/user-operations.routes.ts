import { Router } from "express";
import { sendHTTPResponse } from "../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../server/http/http-middlewares";
import { makeUserOperationLogsController } from "../controller";

export const userOperationsRouter = (): Router => {
  const router = Router();

  router.get("/", authorization, async (req, res) => {
    const data = await makeUserOperationLogsController().getAll({
      ...(req.params || {}),
      ...(req.query || {}),
    });
    return sendHTTPResponse(data, res);
  });

  return router;
};
