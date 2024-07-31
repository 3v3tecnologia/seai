import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { UpdateEquipment } from "../../../domain/use-cases/equipments/update-equipment";
import { badRequest, ok, serverError } from "../helpers";
import { UserOperationControllerDTO } from "../../../@types/login-user";

export class UpdateEquipmentsController
  implements
    Controller<UpdateEquipmentsControllerProtocol.Request, HttpResponse>
{
  private updateEquipment: UpdateEquipment;

  constructor(updateEquipment: UpdateEquipment) {
    this.updateEquipment = updateEquipment;
  }

  async handle(
    request: UpdateEquipmentsControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const resultOrError = await this.updateEquipment.execute(
        {
          IdEquipment: request.id,
          Enable: request.Enable,
        },
        {
          author: request.accountId,
          operation: request.Operation,
        }
      );

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

export namespace UpdateEquipmentsControllerProtocol {
  export type Request = {
    id: number;
    Enable: boolean;
  } & UserOperationControllerDTO;
}
