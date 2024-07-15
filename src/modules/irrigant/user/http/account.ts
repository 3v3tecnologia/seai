import { Request, Response, Router } from "express";
import { sendHTTPResponse } from "../../../../server/http/adapters/express-route.adapter";
import { makeIrrigantAccountController } from "../controllers/factories/account";
import { authorization } from "../../../../server/http/http-middlewares";

export const setupUserIrrigantAccountRoutes = (router: Router): void => {
  const controllers = makeIrrigantAccountController();

  router.post(
    "/irrigant/account",
    async (request: Request, response: Response) => {
      const req = {
        ...(request.body || {}),
        url: request.originalUrl,
        accountId: request.accountId,
      };

      const res = await controllers.create(req);

      return sendHTTPResponse(res, response);
    }
  );

  router.get(
    "/irrigant/account",
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
    "/irrigant/account",
    authorization,
    async (request: Request, response: Response) => {
      const res = await controllers.deleteAccount({
        id: request.accountId as number,
      });

      return sendHTTPResponse(res, response);
    }
  );

  router.patch(
    "/irrigant/account",
    authorization,
    async (request: Request, response: Response) => {
      const req = {
        ...(request.body || {}),
        accountId: request.accountId,
      };

      const res = await controllers.updateProfile(req);

      return sendHTTPResponse(res, response);
    }
  );

  router.post(
    "/irrigant/account/login",
    async (request: Request, response: Response) => {
      const req = {
        ...(request.body || {}),
      };

      const res = await controllers.login(req);

      return sendHTTPResponse(res, response);
    }
  );

  router.patch(
    "/irrigant/account/reset-password/:code",
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
    "/irrigant/account/activate/:code",
    async (request: Request, response: Response) => {
      const req = {
        code: request.params.code as string,
      };

      const res = await controllers.completeRegister(req);

      return sendHTTPResponse(res, response);
    }
  );

  router.post(
    "/irrigant/account/forgot-password",
    async (request: Request, response: Response) => {
      const req = {
        ...(request.body || {}),
      };

      const res = await controllers.forgotPassword(req);

      return sendHTTPResponse(res, response);
    }
  );
};
