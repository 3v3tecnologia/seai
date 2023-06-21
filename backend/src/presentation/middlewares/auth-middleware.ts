import { HttpResponse } from "../controllers/ports";
import { Middleware } from "./ports/middleware";

import { AccessDeniedError } from "../controllers/errors";
import { forbidden, serverError } from "../controllers/helpers";

export class AuthMiddleware implements Middleware {
  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request;

      if (accessToken) {
      }

      return forbidden(new AccessDeniedError());
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string;
  };
}
