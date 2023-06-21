import { Response, Request, NextFunction } from "express";
import { Middleware } from "../../../presentation/middlewares/ports";

export const adaptMiddleware = (middleware: Middleware) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const headerToken = request.headers?.authorization;
    console.log("token:::", headerToken);

    const splittedHeader = headerToken?.split(" ");

    const token = splittedHeader?.[1];

    const req = {
      accessToken: token,
      ...request.headers,
    };

    const result = await middleware.handle(req);

    if (result.statusCode === 200) {
      const userInfo = result.body;

      Object.assign(request, userInfo);

      return next();
    }

    response.status(result.statusCode).json(result.body.message);
  };
};
