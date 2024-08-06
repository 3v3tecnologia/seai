import { HttpResponse } from "../ports/http-response";
import { ServerError } from "../errors/server-error";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { Logger } from "./logger";
import { AccessDeniedError } from "../errors/access-denied-error";

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data,
});

export const forbidden = (error: Error): HttpResponse => {
  Logger.warn("Access denied");
  return {
    statusCode: 403,
    body: error,
  };
};

export const unauthorized = (): HttpResponse => {
  Logger.warn("Access denied");
  return {
    statusCode: 401,
    body: new AccessDeniedError(),
  };
};

export const unauthenticated = (): HttpResponse => {
  Logger.warn("User unauthenticated");
  return {
    statusCode: 401,
    body: new UnauthorizedError(),
  };
};

export const badRequest = (error: Error): HttpResponse => {
  Logger.error(error.message);
  return {
    statusCode: 400,
    body: error,
  };
};

export const serverError = (error: Error): HttpResponse => {
  Logger.error(error.message);
  return {
    statusCode: 500,
    body: new ServerError(error.stack as string),
  };
};

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null,
});
