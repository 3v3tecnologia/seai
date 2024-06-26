import { HttpResponse } from "../ports/http-response";
import { ServerError } from "../errors/server-error";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { AccessDeniedError } from "../errors";

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data,
});

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error,
});

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new AccessDeniedError(),
});

export const unauthenticated = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
});

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack as string),
});

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null,
});
