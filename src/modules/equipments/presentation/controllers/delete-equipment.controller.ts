import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { DeleteEquipment } from "../../services/delete-equipment";
import { RegisterUserLogs } from "../../../logs/services/register-user-logs";
import { badRequest, ok, serverError } from "../../../../presentation/controllers/helpers";

export class DeleteEquipmentController
  implements
  Controller<DeleteEquipmentsControllerProtocol.Request, HttpResponse> {
  private deleteEquipment: DeleteEquipment;
  private userLogs: RegisterUserLogs;

  constructor(deleteEquipment: DeleteEquipment, userLogs: RegisterUserLogs) {
    this.deleteEquipment = deleteEquipment;
    this.userLogs = userLogs;
  }

  async handle(
    request: DeleteEquipmentsControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const resultOrError = await this.deleteEquipment.execute({
        IdEquipment: request.id,
      });

      if (resultOrError.isLeft()) {
        return badRequest(resultOrError.value);
      }

      await this.userLogs.log(request.accountId, this.deleteEquipment);

      return ok(resultOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace DeleteEquipmentsControllerProtocol {
  export type Request = {
    accountId: number;
    id: number;
  };
}
