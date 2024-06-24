import { Request, Response, Router } from "express";
import { sendHTTPResponse } from "../../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../../server/http/http-middlewares";
import { makeIrrigantAccountController } from "../controllers/factories/account";

export const setupUserIrrigantAccountRoutes = (router: Router): void => {
  const controllers = makeIrrigantAccountController();

  router.post("/irrigant", async (request: Request, response: Response) => {
    const req = {
      ...(request.body || {}),
      url: request.originalUrl,
      accountId: request.accountId,
    };

    const res = await controllers.create(req);

    return sendHTTPResponse(res, response);
  });
};
