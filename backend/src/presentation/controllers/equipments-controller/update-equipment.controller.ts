import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { CreateEquipments } from "../../../domain/use-cases/equipments/create-equipment";

import { ok, badRequest, serverError } from "../helpers";
import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { UpdateEquipment } from "../../../domain/use-cases/equipments/update-equipment";

export class UpdateEquipmentsController
  implements
    Controller<UpdateEquipmentsControllerProtocol.Request, HttpResponse>
{
  private updateEquipment: UpdateEquipment;
  private userLogs: RegisterUserLogs;

  constructor(updateEquipment: UpdateEquipment, userLogs: RegisterUserLogs) {
    this.updateEquipment = updateEquipment;
    this.userLogs = userLogs;
  }

  async handle(
    request: UpdateEquipmentsControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const dto = {
        IdEquipment: request.id,
        IdEquipmentExternal: request.IdEquipmentExternal,
        Name: request.Name,
        Altitude: request.Altitude,
        Fk_Organ: request.Fk_Organ,
        Fk_Type: request.Fk_Type,
      };

      const resultOrError = await this.updateEquipment.execute(dto);

      if (resultOrError.isLeft()) {
        return badRequest(resultOrError.value);
      }

      await this.userLogs.log(request.accountId, this.updateEquipment);

      return ok(resultOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace UpdateEquipmentsControllerProtocol {
  export type Request = {
    accountId: number;
    id: number;
    IdEquipmentExternal: string;
    Name: string;
    Altitude: number;
    Fk_Organ: number;
    Fk_Type: number;
  };
}
