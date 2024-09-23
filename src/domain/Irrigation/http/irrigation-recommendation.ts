import { Request, Response, Router } from "express";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { adaptHTTPHandler } from "../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../server/http/http-middlewares";
import { IrrigationRecommendationControllers } from "../controllers/irrigantion-recommendation.controller";
import { UserIrrigationControllers } from "../controllers/user-irrigation.controller";
import { irrigationRecommendation } from "../services/factories/irrigation-suggestion";

export const setupIrrigationRecommendationV2Routes = (router: Router): void => {


  router.post(
    "/management/blade_suggestion",
    adaptHTTPHandler(IrrigationRecommendationControllers.calcIrrigationRecommendation)
  );


  router.post(
    "/management/user/irrigation_crops",
    authorization,
    adaptHTTPHandler(UserIrrigationControllers.create)
  );

  router.get(
    "/management/user/irrigation_crops",
    authorization,
    adaptHTTPHandler(UserIrrigationControllers.getAllIrrigationCrops)
  );

  router.get(
    "/management/user/irrigation_crops/:id",
    authorization,
    adaptHTTPHandler(UserIrrigationControllers.getIrrigationCropsById)
  );

  router.get(
    "/management/user/irrigation_crops/recommendation/:id",
    authorization,
    adaptHTTPHandler(IrrigationRecommendationControllers.calcIrrigationRecommendationById)
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


        await pipeline(irrigationRecommendation.calPerUsers(), addChunkLineBreaker, res, {
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
    adaptHTTPHandler(UserIrrigationControllers.deleteIrrigationCrops)
  );

  router.patch(
    "/management/user/irrigation_crops/:id",
    authorization,
    adaptHTTPHandler(UserIrrigationControllers.updateIrrigationCropsById)
  );
};
