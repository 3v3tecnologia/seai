import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { CreateEquipments } from "../../../domain/use-cases/equipments/create-equipment";

import { ok, badRequest, serverError } from "../helpers";
import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";

export class CreateEquipmentsController
  implements
    Controller<CreateEquipmentsControllerProtocol.Request, HttpResponse>
{
  private createEquipments: CreateEquipments;
  private userLogs: RegisterUserLogs;

  constructor(createEquipments: CreateEquipments, userLogs: RegisterUserLogs) {
    this.createEquipments = createEquipments;
    this.userLogs = userLogs;
  }

  async handle(
    request: CreateEquipmentsControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const resultOrError = await this.createEquipments.execute({
        Name: request.Name,
        Fk_Organ: request.Fk_Organ,
        Fk_Type: request.Fk_Type,
        IdEquipmentExternal: request.IdEquipmentExternal,
        Altitude: request.Altitude,
        Location: request.Location,
        Enable: request.Enable,
      });

      if (resultOrError.isLeft()) {
        return badRequest(resultOrError.value);
      }

      await this.userLogs.log(request.accountId, this.createEquipments);

      return ok(resultOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace CreateEquipmentsControllerProtocol {
  export type Request = {
    accountId: number;
    IdEquipmentExternal: string;
    Name: string;
    Altitude: number;
    Location: {
      Name: string;
      Coordinates: Array<number>;
    };
    Fk_Organ: number;
    Fk_Type: number;
    Enable: boolean;
  };
}
