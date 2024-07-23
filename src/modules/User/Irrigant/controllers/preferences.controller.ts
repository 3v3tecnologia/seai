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
import {
  deleteEquipmentsValidator,
  getEquipmentsValidator,
  getNotificationsValidator,
  saveEquipmentsValidator,
  updateEquipmentsValidator,
  updateNotificationsValidator,
} from "./schema/preferences";

export class UserPreferencesControllers {
  constructor(private services: IUserPreferencesServices) {}

  async saveEquipments(request: SaveEquipmentsRequest): Promise<HttpResponse> {
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

      const successOrError = await this.services.saveEquipments({
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

  async deleteEquipments(
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

      const successOrError = await this.services.deleteEquipments(id);

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
      const { PluviometerId, StationId, accountId } = request;

      const { error } = await updateEquipmentsValidator.validate({
        PluviometerId,
        StationId,
        accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const successOrError = await this.services.updateEquipments({
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

  async getEquipments(request: GetEquipmentsRequest): Promise<HttpResponse> {
    try {
      const { accountId } = request;

      const { error } = await getEquipmentsValidator.validate({
        accountId,
      });

      if (error) {
        return badRequest(error);
      }
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
      const { Enabled, id, accountId } = request;

      const { error } = await updateNotificationsValidator.validate({
        Enabled,
        accountId,
        id,
      });

      if (error) {
        return badRequest(error);
      }

      const response = await this.services.updateUserNotificationPreference({
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

  async getUserNotificationsPreferences(
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
