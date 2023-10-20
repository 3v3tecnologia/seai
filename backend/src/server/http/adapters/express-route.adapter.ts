import { Response, Request } from "express";

import { Controller } from "../../../presentation/controllers/ports/controllers";

export const adaptRoute = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const req = {
      ...(request.body || {}),
      ...(request.params || {}),
      ...(request.query || {}),
      accountId: request.accountId,
      accessToken: request.accessToken || null,
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
