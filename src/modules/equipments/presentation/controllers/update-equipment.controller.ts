import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { ok, badRequest, serverError } from "../../../../presentation/controllers/helpers";
import { RegisterUserLogs } from "../../../logs/services/register-user-logs";
import { UpdateEquipment } from "../../services/update-equipment";

export class UpdateEquipmentsController
  implements
  Controller<UpdateEquipmentsControllerProtocol.Request, HttpResponse> {
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
        /*IdEquipmentExternal: request.IdEquipmentExternal,
        Name: request.Name,
        Fk_Organ: request.Fk_Organ,
        Fk_Type: request.Fk_Type,
        Altitude: request.Altitude,
        Location: request.Location,*/
        Enable: request.Enable,
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
    /*IdEquipmentExternal: string;
    Name: string;
    Fk_Organ: number;
    Fk_Type: number;
    Altitude: number;
    Location: {
      Name: string;
      Coordinates: Array<number>;
    };*/
    Enable: boolean;
  };
}
