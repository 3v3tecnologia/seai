import { Router } from "express";
import { adaptHTTPHandler } from "../../../server/http/adapters/express-route.adapter";
import {
  authorization,
  cropPermissions,
} from "../../../server/http/http-middlewares";
import { ManagementCropController } from "../controllers/crop.controller";

export const setupManagementCropV2Routes = (router: Router): void => {

  router.get(
    "/management/crop/:id",
    authorization,
    cropPermissions.read,
    adaptHTTPHandler(ManagementCropController.getCropById)
  );

  router.post(
    "/management/crop",
    authorization,
    cropPermissions.write,
    adaptHTTPHandler(ManagementCropController.create)
  );

  router.put(
    "/management/crop/:id",
    authorization,
    cropPermissions.write,
    adaptHTTPHandler(ManagementCropController.update)
  );

  router.patch(
    "/management/crop/:id/cycle/restart-point",
    authorization,
    cropPermissions.write,
    adaptHTTPHandler(ManagementCropController.setCropCycleRestartPoint)
  );

  router.delete(
    "/management/crop/:id",
    authorization,
    cropPermissions.write,
    adaptHTTPHandler(ManagementCropController.deleteCrop)
  );

  router.get(
    "/management/crop/cycles/:id",
    authorization,
    cropPermissions.write,
    adaptHTTPHandler(ManagementCropController.getAllCropCycles)
  );


  //Irrigant
  router.get(
    "/management/crops",
    adaptHTTPHandler(ManagementCropController.getAllCrops)
  );
};
