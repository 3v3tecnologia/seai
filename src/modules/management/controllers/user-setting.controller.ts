import {
  badRequest,
  created,
  noContent,
  ok,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { UserSettingsServices } from "../services/user-settings";
import {
  DeleteEquipmentRequest,
  GetEquipmentsRequest,
  SaveEquipmentsRequest,
  UpdateEquipmentsRequest,
} from "./dto/user-settings";

export class UserIrrigantSettingsControllers {
  static async saveEquipments(
    request: SaveEquipmentsRequest
  ): Promise<HttpResponse> {
    try {
      const successOrError = await UserSettingsServices.saveEquipments({
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

  static async deleteEquipments(
    request: DeleteEquipmentRequest
  ): Promise<HttpResponse> {
    try {
      const successOrError = await UserSettingsServices.deleteEquipments(
        request.id
      );

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
      const successOrError = await UserSettingsServices.updateEquipments({
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

  static async getEquipments(
    request: GetEquipmentsRequest
  ): Promise<HttpResponse> {
    try {
      const successOrError = await UserSettingsServices.getEquipments(
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
}
