import { Router } from "express";
import { adaptHTTPHandler } from "../../../server/http/adapters/express-route.adapter";
import {
  authorization,
  cropPermissions,
} from "../../../server/http/http-middlewares";
import { makeManagementCropControllers } from "../controllers/factories/crop.controller";

export const setupManagementCropV2Routes = (router: Router): void => {
  const controllers = makeManagementCropControllers();

  router.get(
    "/management/crop/:id",
    authorization,
    cropPermissions.read,
    adaptHTTPHandler(controllers.getCropById.bind(controllers))
  );

  router.post(
    "/management/crop",
    authorization,
    cropPermissions.write,
    adaptHTTPHandler(controllers.create.bind(controllers))
  );

  router.put(
    "/management/crop/:id",
    authorization,
    cropPermissions.write,
    adaptHTTPHandler(controllers.update.bind(controllers))
  );

  router.delete(
    "/management/crop/:id",
    authorization,
    cropPermissions.write,
    adaptHTTPHandler(controllers.deleteCrop.bind(controllers))
  );

  router.get(
    "/management/crop/cycles/:id",
    authorization,
    cropPermissions.write,
    adaptHTTPHandler(controllers.getAllCropCycles.bind(controllers))
  );

  router.post(
    "/management/crop/cycles/:id",
    authorization,
    cropPermissions.write,
    adaptHTTPHandler(controllers.createCropCycles.bind(controllers))
  );

  //Irrigant
  router.get(
    "/management/crops",
    adaptHTTPHandler(controllers.getAllCrops.bind(controllers))
  );
};
