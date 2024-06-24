import { Response, Request } from "express";

import { Controller } from "../../../presentation/controllers/ports/controllers";
import { HttpResponse } from "../../../presentation/controllers/ports";

export function sendHTTPResponse(res: HttpResponse, response: Response) {
  if (res.statusCode >= 200 && res.statusCode < 300) {
    return response.status(res.statusCode).json({
      data: res.body,
    });
  }

  //Enviar a mensagem do erro, evitar passar muitas informações detalhadas
  return response.status(res.statusCode).json({
    error: res.body.message,
  });
}

export const adaptRouteV2 = (callback: any) => {
  return async (request: Request, response: Response) => {
    const req = {
      ...(request.body || {}),
      ...(request.params || {}),
      ...(request.query || {}),
      url: request.originalUrl,
      accountId: request.accountId,
      accessToken: request.accessToken || null,
      accessKey: request.accessKey || null,
    };

    const res = await callback(req);

    if (res.statusCode >= 200 && res.statusCode < 300) {
      return response.status(res.statusCode).json({
        data: res.body,
      });
    }

    //Enviar a mensagem do erro, evitar passar muitas informações detalhadas
    return response.status(res.statusCode).json({
      error: res.body.message,
    });
  };
};

export const adaptRoute = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const req = {
      ...(request.body || {}),
      ...(request.params || {}),
      ...(request.query || {}),
      url: request.originalUrl,
      accountId: request.accountId,
      accessToken: request.accessToken || null,
      accessKey: request.accessToken || null,
    };

    const res = await controller.handle(req);

    if (res.statusCode >= 200 && res.statusCode < 300) {
      return response.status(res.statusCode).json({
        data: res.body,
      });
    }

    //Enviar a mensagem do erro, evitar passar muitas informações detalhadas
    return response.status(res.statusCode).json({
      error: res.body.message,
    });
  };
};
