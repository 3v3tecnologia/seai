import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";
import { Response, Request } from "express";

import { authorization } from "../http-middlewares";
import {
  ManagementControllersFactory,
  managementControllerFactory,
} from "../factories/controllers";

function formatRequest(request: Request) {
  return {
    ...(request.body || {}),
    ...(request.params || {}),
    ...(request.query || {}),
    url: request.originalUrl,
    accountId: request.accountId,
    accessToken: request.accessToken || null,
  };
}

function formatResponse(res: any) {
  if (res.statusCode >= 200 && res.statusCode < 300) {
    return {
      status: res.statusCode,
      data: {
        data: res.body,
      },
    };
  }

  //Enviar a mensagem do erro, evitar passar muitas informações detalhadas
  return {
    status: res.statusCode,
    data: {
      error: res.body.message,
    },
  };
}

async function handler(request: Request, response: Response, callback: any) {
  const req = formatRequest(request);

  console.log(req);

  const res = await callback(req);

  const { data, status } = formatResponse(res);

  return response.status(status).json(data);
}

export const managementRouter = (): Router => {
  const router = Router();

  router.post(
    "/weights/:id",
    authorization,
    adaptRoute(ManagementControllersFactory.makeInsertManagementWeights())
  );

  router.get(
    "/weights/:id",
    authorization,
    adaptRoute(ManagementControllersFactory.makeGetWeightsByBasin())
  );

  router.delete(
    "/weights/:id",
    authorization,
    adaptRoute(ManagementControllersFactory.makeDeleteWeightsByBasin())
  );

  router.post(
    "/studies/:id",
    authorization,
    adaptRoute(ManagementControllersFactory.makeInsertManagementStudies())
  );

  router.get(
    "/studies/:id",
    authorization,
    adaptRoute(ManagementControllersFactory.makeGetStudiesByBasin())
  );

  router.delete(
    "/studies/:id",
    authorization,
    adaptRoute(ManagementControllersFactory.makeDeleteStudiesByBasin())
  );

  router.post(
    "/crop",
    authorization,
    async (request: Request, response: Response) => {
      const req = formatRequest(request);

      const res = await managementControllerFactory.create(req);

      const { data, status } = formatResponse(res);

      return response.status(status).json(data);
    }
  );

  router.put(
    "/crop/:id",
    authorization,
    async (request: Request, response: Response) => {
      const req = formatRequest(request);

      const res = await managementControllerFactory.update(req);

      const { data, status } = formatResponse(res);

      return response.status(status).json(data);
    }
  );

  router.delete(
    "/crop/:id",
    authorization,
    async (request: Request, response: Response) => {
      const req = formatRequest(request);

      const res = await managementControllerFactory.delete(req);

      const { data, status } = formatResponse(res);

      return response.status(status).json(data);
    }
  );

  router.get(
    "/crop/:id",
    authorization,
    async (request: Request, response: Response) => {
      const req = formatRequest(request);

      const res = await managementControllerFactory.getById(req);

      const { data, status } = formatResponse(res);

      return response.status(status).json(data);
    }
  );

  router.get(
    "/crop",
    authorization,
    async (request: Request, response: Response) => {
      const req = formatRequest(request);

      const res = await managementControllerFactory.getAll(req);

      const { data, status } = formatResponse(res);

      return response.status(status).json(data);
    }
  );

  return router;
};
