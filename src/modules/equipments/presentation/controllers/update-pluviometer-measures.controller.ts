import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { UpdatePluviometerMeasures } from "../../services/update-pluviometer-measures";
import { RegisterUserLogs } from "../../../system-logs/services/register-user-logs";
import { badRequest, ok, serverError } from "../../../../presentation/controllers/helpers";

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
