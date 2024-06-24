import { Router } from "express";
import { adaptRouteV2 } from "../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../server/http/http-middlewares";
import { IrrigationRecommendationControllers } from "../controllers/irrigantion-recommendation.controller";

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
