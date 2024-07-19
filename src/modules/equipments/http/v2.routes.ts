import { Request, Response, Router } from "express";
import {
  sendHTTPResponse
} from "../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../server/http/http-middlewares";
import { makeEquipmentsControllers } from "../controllers/factories/equipments";
import { makeEquipmentsMeasurementsControllers } from "../controllers/factories/measurements";

export const setupEquipmentsV2Routes = (router: Router): void => {
  const controllers = makeEquipmentsControllers();

  const equipmentsMeasurementsControllers =
    makeEquipmentsMeasurementsControllers();

  router.get(
    "/equipments",
    authorization,
    async (request: Request, response: Response) => {
      const req = {
        type: request.query.type as "station" | "pluviometer",
      };

      const result = await controllers.getAll(req);

      return sendHTTPResponse(result, response);
    }
  );

  router.get(
    "/equipments/types",
    authorization,
    async (request: Request, response: Response) => {
      const result = await controllers.getAllEquipmentsTypes();

      return sendHTTPResponse(result, response);
    }
  );

  router.post(
    "/equipments",
    authorization,
    async (request: Request, response: Response) => {
      const req = {
        ...(request.body || {}),
      };

      const result = await controllers.bulkInsert(req);

      return sendHTTPResponse(result, response);
    }
  );

  router.get(
    "/equipments/last-updated-at",
    authorization,
    async (request: Request, response: Response) => {
      const result = await controllers.getDateOfLastMeasurementTaken();

      return sendHTTPResponse(result, response);
    }
  );

  router.get(
    "/equipments/meteorological_organ/access_credentials",
    authorization,
    async (request: Request, response: Response) => {
      const req = {
        organName: request.query.organName as string,
      };

      const result = await controllers.getMeteorologicalOrganAccessCredentials(
        req
      );

      return sendHTTPResponse(result, response);
    }
  );

  router.get(
    "/equipments/measurements",
    authorization,
    async (request: Request, response: Response) => {
      const req = {
        ...(request.body || {}),
      };

      const result =
        await equipmentsMeasurementsControllers.getByEquipmentsCodesAndDate(
          req
        );

      return sendHTTPResponse(result, response);
    }
  );

  router.post(
    "/equipments/measurements",
    async (request: Request, response: Response) => {
      const req = {
        ...(request.body || {}),
      };

      const result = await equipmentsMeasurementsControllers.bulkInsert(req);

      return sendHTTPResponse(result, response);
    }
  );
};
