import { Request, Response, Router } from "express";
import { sendHTTPResponse } from "../../../../server/http/adapters/express-route.adapter";
import { authorization } from "../../../../server/http/http-middlewares";
import { makeUserIrrigantPreferencesControllers } from "../controllers/factories/preferences";

export const setupUserIrrigantSettingsV2Routes = (router: Router): void => {
  const controllers = makeUserIrrigantPreferencesControllers();

  router.post(
    "/management/user/settings/equipments",
    authorization,
    async (request: Request, response: Response) => {
      const req = {
        ...(request.body || {}),
        url: request.originalUrl,
        accountId: request.accountId,
      };

      const res = await controllers.saveEquipments(req);

      return sendHTTPResponse(res, response);
    }
  );

  router.delete(
    "/management/user/settings/equipments/:id",
    authorization,
    async (request: Request, response: Response) => {
      const req = {
        id: +request.params.id,
        accountId: request.accountId,
      };

      const res = await controllers.deleteEquipments(req);

      return sendHTTPResponse(res, response);
    }
  );

  router.patch(
    "/management/user/settings/equipments",
    authorization,
    async (request: Request, response: Response) => {
      const req = {
        ...(request.body || {}),
        accountId: request.accountId,
      };

      const res = await controllers.updateEquipments(req);

      return sendHTTPResponse(res, response);
    }
  );

  router.get(
    "/management/user/settings/equipments",
    authorization,
    async (request: Request, response: Response) => {
      const res = await controllers.getEquipments({
        accountId: request.accountId as number,
      });

      return sendHTTPResponse(res, response);
    }
  );

  router.patch(
    "/management/user/settings/notifications/:id",
    authorization,
    async (request: Request, response: Response) => {
      const res = await controllers.updateUserNotificationPreference({
        accountId: request.accountId as number,
        Enabled: request.body.Enabled,
        id: parseInt(request.params.id),
      });

      return sendHTTPResponse(res, response);
    }
  );

  router.get(
    "/management/user/settings/notifications",
    authorization,
    async (request: Request, response: Response) => {
      const res = await controllers.getUserNotificationsPreferences({
        accountId: request.accountId as number,
      });

      return sendHTTPResponse(res, response);
    }
  );
};
