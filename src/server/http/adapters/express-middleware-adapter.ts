import { Response, Request, NextFunction } from "express";
import { Middleware } from "../../../presentation/middlewares/ports";

export const adaptMiddleware = (middleware: Middleware) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const headerToken = request.headers?.authorization;
    const accessKey = request.headers["access-key"];

    const splittedHeader = headerToken?.split(" ");

    const authType = splittedHeader?.[0];
    const token = splittedHeader?.[1];

    const req = {
      accountId: request.accountId,
      accessToken: token,
      accessKey,
      authType,
      url: request.originalUrl,
      method: request.method,
      ...request.headers,
      ...(request.query || {}),
      ...(request.params || {}),
    };


    const result = await middleware.handle(req);

    if (result.statusCode === 200) {
      const userInfo = result.body;
      if (!Reflect.has(request, "accountId")) {
        Object.assign(request, userInfo);
      }

      return next();
    }

    response.status(result.statusCode).json({ error: result.body.message });
  };
};
