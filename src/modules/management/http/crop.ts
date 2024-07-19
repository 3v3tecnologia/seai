import { Request, Response, Router } from "express";
import { sendHTTPResponse } from "../../../server/http/adapters/express-route.adapter";
import { authorization, cropPermissions } from "../../../server/http/http-middlewares";
import { makeManagementCropControllers } from "../controllers/factories/crop.controller";

export const setupManagementCropV2Routes = (router: Router): void => {
  const controllers = makeManagementCropControllers();

  router.get(
    "/management/crop/:id",
    authorization,
    cropPermissions.read,
    async (request: Request, response: Response) => {
      const req = {
        id: +request.params.id,
        accountId: request.accountId,
      };

      const result = await controllers.getCropById(req);

      return sendHTTPResponse(result, response);
    }
  );

  router.post(
    "/management/crop",
    authorization,
    cropPermissions.write,
    async (request: Request, response: Response) => {
      const req = {
        id: +request.params.id,
        accountId: request.accountId,
        ...(request.body || {}),
      };

      const result = await controllers.createCrop(req);

      return sendHTTPResponse(result, response);
    }
  );

  router.put(
    "/management/crop/:id",
    authorization,
    cropPermissions.write,
    async (request: Request, response: Response) => {
      const req = {
        id: +request.params.id,
        accountId: request.accountId,
        ...(request.body || {}),
      };

      const result = await controllers.updateCrop(req);

      return sendHTTPResponse(result, response);
    }
  );

  router.delete(
    "/management/crop/:id",
    authorization,
    cropPermissions.write,
    async (request: Request, response: Response) => {
      const req = {
        id: +request.params.id,
        accountId: request.accountId,
      };

      const result = await controllers.deleteCrop(req);

      return sendHTTPResponse(result, response);
    }
  );

  router.get(
    "/management/crop/cycles/:id",
    authorization,
    cropPermissions.write,
    async (request: Request, response: Response) => {
      const req = {
        id: +request.params.id,
      };

      const result = await controllers.getAllCropCycles(req);

      return sendHTTPResponse(result, response);
    }
  );
  
  router.post(
    "/management/crop/cycles/:id",
    authorization,
    cropPermissions.write,
    async (request: Request, response: Response) => {
      const req = {
        id: +request.params.id,
        accountId: request.accountId,
        ...(request.body || {}),
      };

      const result = await controllers.createCropCycles(req);

      return sendHTTPResponse(result, response);
    }
  );

  //Irrigant
  router.get(
    "/management/crops",
    async (request: Request, response: Response) => {
      const req = {
        id: +request.params.id,
        accountId: request.accountId,
        ...(request.body || {}),
      };

      const result = await controllers.getAllCrops(req);

      return sendHTTPResponse(result, response);
    }
  );
};
