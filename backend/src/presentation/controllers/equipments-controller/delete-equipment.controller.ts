import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { DeleteEquipment } from "../../../domain/use-cases/equipments/delete-equipment";
import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { badRequest, ok, serverError } from "../helpers";

export class DeleteEquipmentController
  implements
    Controller<DeleteEquipmentsControllerProtocol.Request, HttpResponse>
{
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
