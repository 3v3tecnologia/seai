import { Request, Response, Router } from "express";
import { makeIrrigantAccountController } from "../../controllers/factories/account";
import { sendHTTPResponse } from "../../../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../../../server/http/http-middlewares";

export const irrigationUserRoutes = (): Router => {
  const router = Router();

  const controllers = makeIrrigantAccountController();

  router.post("/", async (request: Request, response: Response) => {
    const req = {
      ...(request.body || {}),
      url: request.originalUrl,
      accountId: request.accountId,
    };

    const res = await controllers.create(req);

    return sendHTTPResponse(res, response);
  });

  router.get(
    "/",
    authorization,
    async (request: Request, response: Response) => {
      const req = {
        accountId: request.accountId as number,
      };

      const res = await controllers.getProfile(req);

      return sendHTTPResponse(res, response);
    }
  );

  router.delete(
    "/",
    authorization,
    async (request: Request, response: Response) => {
      const res = await controllers.deleteAccount({
        id: request.accountId as number,
      });

      return sendHTTPResponse(res, response);
    }
  );

  router.patch(
    "/",
    authorization,
    async (request: Request, response: Response) => {
      const req = {
        ...(request.body || {}),
        accountId: request.accountId,
      };

      console.log(req);

      const res = await controllers.updateProfile(req);

      return sendHTTPResponse(res, response);
    }
  );

  router.post("/login", async (request: Request, response: Response) => {
    const req = {
      ...(request.body || {}),
    };

    const res = await controllers.login(req);

    return sendHTTPResponse(res, response);
  });

  router.patch(
    "/reset-password/:code",
    async (request: Request, response: Response) => {
      const req = {
        ...(request.body || {}),
        code: request.params.code,
      };

      const res = await controllers.resetPassword(req);

      return sendHTTPResponse(res, response);
    }
  );

  router.patch(
    "/activate/:code",
    async (request: Request, response: Response) => {
      const req = {
        code: request.params.code as string,
      };

      const res = await controllers.completeRegister(req);

      return sendHTTPResponse(res, response);
    }
  );

  router.post(
    "/forgot-password",
    async (request: Request, response: Response) => {
      const req = {
        ...(request.body || {}),
      };

      const res = await controllers.forgotPassword(req);

      return sendHTTPResponse(res, response);
    }
  );

  return router;
};
