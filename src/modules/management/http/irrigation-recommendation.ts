import { Request, Response, Router } from "express";
import { adaptRouteV2 } from "../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../server/http/http-middlewares";
import { IrrigationRecommendationControllers } from "../controllers/irrigantion-recommendation.controller";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { UserRecommendationsServices } from "../services/user-irrigation.service";

export const setupIrrigationRecommendationV2Routes = (router: Router): void => {
  router.post(
    "/management/blade_suggestion",
    adaptRouteV2(
      IrrigationRecommendationControllers.calcIrrigationRecommendation
    )
  );

  router.post(
    "/management/user/irrigation_crops",
    authorization,
    adaptRouteV2(IrrigationRecommendationControllers.saveIrrigationCrops)
  );

  router.get(
    "/management/user/irrigation_crops",
    authorization,
    adaptRouteV2(IrrigationRecommendationControllers.getAllIrrigationCrops)
  );

  router.get(
    "/management/user/irrigation_crops/:id",
    authorization,
    adaptRouteV2(IrrigationRecommendationControllers.getIrrigationCropsById)
  );

  router.get(
    "/management/user/irrigation_crops/recommendation/:id",
    authorization,
    adaptRouteV2(
      IrrigationRecommendationControllers.calcIrrigationRecommendationById
    )
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

        const dataSource =
          UserRecommendationsServices.calcUsersRecommendations();

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
    adaptRouteV2(IrrigationRecommendationControllers.deleteIrrigationCrops)
  );

  router.patch(
    "/management/user/irrigation_crops/:id",
    authorization,
    adaptRouteV2(IrrigationRecommendationControllers.updateIrrigationCropsById)
  );
};
