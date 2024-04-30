import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { UpdatePluviometerMeasures } from "../../../domain/use-cases/equipments/update-pluviometer-measures";
import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { badRequest, ok, serverError } from "../helpers";

export class UpdatePluviometerController
  implements
  Controller<UpdateEquipmentsControllerProtocol.Request, HttpResponse> {
  private updateEquipment: UpdatePluviometerMeasures;
  private userLogs: RegisterUserLogs;

  constructor(
    updateEquipment: UpdatePluviometerMeasures,
    userLogs: RegisterUserLogs
  ) {
    this.updateEquipment = updateEquipment;
    this.userLogs = userLogs;
  }

  async handle(
    request: UpdateEquipmentsControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const dto = {
        IdRead: request.id,
        Precipitation: request.Precipitation,
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
    Precipitation: number | null;
  };
}
