import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { DeleteEquipment } from "../../../domain/use-cases/equipments/delete-equipment";
import { badRequest, ok, serverError } from "../helpers";

export class DeleteEquipmentController
  implements
    Controller<DeleteEquipmentsControllerProtocol.Request, HttpResponse>
{
  private deleteEquipment: DeleteEquipment;

  constructor(deleteEquipment: DeleteEquipment) {
    this.deleteEquipment = deleteEquipment;
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
