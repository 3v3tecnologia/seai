import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  created,
  noContent,
  ok,
} from "../../../shared/utils/http-responses";
import {
  DeleteEquipmentRequest,
  GetEquipmentsRequest,
  SaveEquipmentsRequest,
  UpdateEquipmentsRequest,
} from "../../Irrigation/controllers/dto/user-settings";
import { irrigantSettingsService } from "../services/factories/irrigation-settings";

import {
  GetUserNotificationsPreferences,
  UpdateUserPreferencesRequest,
} from "./requests/irrigant-settings";
import { deleteEquipmentsValidator, getEquipmentsValidator, getNotificationsValidator, saveEquipmentsValidator, updateEquipmentsValidator, updateNotificationsValidator } from "./schema/irrigant-settings";

export class UserPreferencesControllers {

  static async saveEquipments(request: SaveEquipmentsRequest): Promise<HttpResponse> {
    try {
      const { PluviometerId, StationId, accountId } = request;

      const { error } = await saveEquipmentsValidator.validate({
        PluviometerId,
        StationId,
        accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const successOrError = await irrigantSettingsService.saveEquipments({
        UserId: accountId,
        PluviometerId: PluviometerId,
        StationId: StationId,
      });

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return created(successOrError.value);
    } catch (error) {
      return badRequest(error as Error);
    }
  }

  static async deleteEquipments(
    request: DeleteEquipmentRequest
  ): Promise<HttpResponse> {
    try {
      const { id } = request;

      const { error } = await deleteEquipmentsValidator.validate({
        id,
      });

      if (error) {
        return badRequest(error);
      }

      const successOrError = await irrigantSettingsService.deleteEquipments(id);

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return noContent();
    } catch (error) {
      return badRequest(error as Error);
    }
  }

  static async updateEquipments(
    request: UpdateEquipmentsRequest
  ): Promise<HttpResponse> {
    try {
      const { PluviometerId, StationId, accountId } = request;

      const { error } = await updateEquipmentsValidator.validate({
        PluviometerId,
        StationId,
        accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const successOrError = await irrigantSettingsService.updateEquipments({
        UserId: accountId,
        StationId: StationId,
        PluviometerId: PluviometerId,
      });

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return noContent();
    } catch (error) {
      return badRequest(error as Error);
    }
  }

  static async getEquipments(request: GetEquipmentsRequest): Promise<HttpResponse> {
    try {
      const { accountId } = request;

      const { error } = await getEquipmentsValidator.validate({
        accountId,
      });

      if (error) {
        return badRequest(error);
      }
      const successOrError = await irrigantSettingsService.getEquipments(
        request.accountId
      );

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return ok(successOrError.value);
    } catch (error) {
      return badRequest(error as Error);
    }
  }

  static async updateUserNotificationPreference(
    request: UpdateUserPreferencesRequest
  ): Promise<HttpResponse> {
    try {
      const { Enabled, id, accountId } = request;

      const { error } = await updateNotificationsValidator.validate({
        Enabled,
        accountId,
        id,
      });

      if (error) {
        return badRequest(error);
      }

      const response = await irrigantSettingsService.updateUserNotificationPreference({
        Enabled: request.Enabled,
        ServiceId: request.id,
        UserId: request.accountId,
      });

      if (response.isLeft()) {
        return badRequest(response.value);
      }

      return noContent();
    } catch (error) {
      return badRequest(error as Error);
    }
  }

  static async getUserNotificationsPreferences(
    request: GetUserNotificationsPreferences
  ): Promise<HttpResponse> {
    try {
      const { accountId } = request;

      const { error } = await getNotificationsValidator.validate({
        accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const response = await irrigantSettingsService.getUserNotificationsPreferences(
        request.accountId
      );

      if (response.isLeft()) {
        return badRequest(response.value);
      }

      return ok(response.value);
    } catch (error) {
      return badRequest(error as Error);
    }
  }
}
