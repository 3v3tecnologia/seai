import {
  badRequest,
  created,
  noContent,
  ok,
} from "../../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../../presentation/controllers/ports";
import {
  DeleteEquipmentRequest,
  GetEquipmentsRequest,
  SaveEquipmentsRequest,
  UpdateEquipmentsRequest,
} from "../../../management/controllers/dto/user-settings";
import { IUserPreferencesServices } from "../services/protocols/user-settings";
import {
  GetUserNotificationsPreferences,
  UpdateUserPreferencesRequest,
} from "./requests/user-settings";

export class UserPreferencesControllers {
  constructor(private services: IUserPreferencesServices) {}

  async saveEquipments(request: SaveEquipmentsRequest): Promise<HttpResponse> {
    try {
      const successOrError = await this.services.saveEquipments({
        UserId: request.accountId,
        PluviometerId: request.PluviometerId,
        StationId: request.StationId,
      });

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return created(successOrError.value);
    } catch (error) {
      return badRequest(error as Error);
    }
  }

  async deleteEquipments(
    request: DeleteEquipmentRequest
  ): Promise<HttpResponse> {
    try {
      const successOrError = await this.services.deleteEquipments(request.id);

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return noContent();
    } catch (error) {
      return badRequest(error as Error);
    }
  }

  async updateEquipments(
    request: UpdateEquipmentsRequest
  ): Promise<HttpResponse> {
    try {
      const successOrError = await this.services.updateEquipments({
        UserId: request.accountId,
        StationId: request.StationId,
        PluviometerId: request.PluviometerId,
      });

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return noContent();
    } catch (error) {
      return badRequest(error as Error);
    }
  }

  async getEquipments(request: GetEquipmentsRequest): Promise<HttpResponse> {
    try {
      const successOrError = await this.services.getEquipments(
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

  async updateUserNotificationPreference(
    request: UpdateUserPreferencesRequest
  ): Promise<HttpResponse> {
    try {
      const response = await this.services.updateUserNotificationPreference({
        Enabled: request.Enabled,
        ServiceId: request.ServiceId,
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

  async getUserNotificationsPreferences(
    request: GetUserNotificationsPreferences
  ): Promise<HttpResponse> {
    try {
      const response = await this.services.getUserNotificationsPreferences(
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
