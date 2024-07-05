import { Request, Response, Router } from "express";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { sendHTTPResponse } from "../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../server/http/http-middlewares";
import { makeIrrigationRecommendationControllers } from "../controllers/factories/irrigation-recommendation.controller";
import { makeUserIrrigationControllers } from "../controllers/factories/user-irrigation.controller";
import { ManagementCropRepository } from "../repositories/crop.repository";
import { IrrigationCropsRepository } from "../repositories/irrigation.repository";
import { IrrigationCropsSuggestion } from "../services/irrigation-suggestion.service";

export const setupIrrigationRecommendationV2Routes = (router: Router): void => {
  const irrigationControllers = makeIrrigationRecommendationControllers();
  const userIrrigationControllers = makeUserIrrigationControllers();

  router.post(
    "/management/blade_suggestion",
    async (request: Request, response: Response) => {
      const req = {
        accountId: request.accountId,
        ...(request.body || {}),
      };

      const result = await irrigationControllers.calcIrrigationRecommendation(
        req
      );

      return sendHTTPResponse(result, response);
    }
  );

  router.post(
    "/management/user/irrigation_crops",
    authorization,
    async (request: Request, response: Response) => {
      const req = {
        accountId: request.accountId,
        ...(request.body || {}),
      };

      const result = await irrigationControllers.calcIrrigationRecommendation(
        req
      );

      return sendHTTPResponse(result, response);
    }
  );

  router.get(
    "/management/user/irrigation_crops",
    authorization,
    async (request: Request, response: Response) => {
      const req = {
        accountId: request.accountId as number,
      };

      const result = await userIrrigationControllers.getAllIrrigationCrops(req);

      return sendHTTPResponse(result, response);
    }
  );

  router.get(
    "/management/user/irrigation_crops/:id",
    authorization,
    async (request: Request, response: Response) => {
      const req = {
        id: +request.params.id,
        accountId: request.accountId as number,
      };

      const result = await userIrrigationControllers.getIrrigationCropsById(
        req
      );

      return sendHTTPResponse(result, response);
    }
  );

  router.get(
    "/management/user/irrigation_crops/recommendation/:id",
    authorization,
    async (request: Request, response: Response) => {
      const req = {
        id: +request.params.id,
        accountId: request.accountId as number,
      };

      const result =
        await irrigationControllers.calcIrrigationRecommendationById(req);

      return sendHTTPResponse(result, response);
    }
  );

  router.get(
    "/management/irrigation_crops/recommendations",
    authorization,
    async (req: Request, res: Response) => {
      try {
        res.writeHead(200, {
          "Content-Type": "text/plain",
          "Transfer-Encoding": "chunked",
        });

        req.once("close", () => {
          console.log("Client has disconnected");
        });

        req.once("end", () => {
          console.log("All sended");
        });

        const abortController = new AbortController();

        const addChunkLineBreaker = new Transform({
          objectMode: true,
          encoding: "utf8",
          transform(chunk, enc, cb) {
            console.log("chunk ", chunk);

            const data = {
              Name: chunk.Name,
              Email: chunk.Email,
              Irrigation: chunk.Irrigation,
            };

            if (chunk.Notification) {
              Object.assign(data, {
                Notification: chunk.Notification,
              });
            }

            cb(
              null,
              JSON.stringify(data).concat("\n") //Add LF (Line Feed)  to indicate the end of a line creating a chunk
            );
          },
        });

        const dataSource = new IrrigationCropsSuggestion(
          new IrrigationCropsRepository(),
          new ManagementCropRepository(),
          new IrrigationCropsRepository()
        ).calPerUsers();

        await pipeline(dataSource, addChunkLineBreaker, res, {
          signal: abortController.signal,
        });
      } catch (error) {
        res.status(500).end();
      }
    }
  );

  router.delete(
    "/management/user/irrigation_crops/:id",
    authorization,
    async (request: Request, response: Response) => {
      const req = {
        id: +request.params.id,
        accountId: request.accountId as number,
      };

      const result = await userIrrigationControllers.deleteIrrigationCrops(req);

      return sendHTTPResponse(result, response);
    }
  );

  router.patch(
    "/management/user/irrigation_crops/:id",
    authorization,
    async (request: Request, response: Response) => {
      const req = {
        id: +request.params.id,
        accountId: request.accountId as number,
        ...(request.body || {}),
      };

      const result = await userIrrigationControllers.updateIrrigationCropsById(
        req
      );

      return sendHTTPResponse(result, response);
    }
  );
};
