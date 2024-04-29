import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok, badRequest, serverError } from "../helpers";
import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { UpdateStationMeasurements } from "../../../domain/use-cases/equipments/update-station-measures";

export class UpdateStationMeasuresController
  implements
  Controller<UpdateStationMeasuresControllerProtocol.Request, HttpResponse> {
  private updateEquipment: UpdateStationMeasurements;
  private userLogs: RegisterUserLogs;

  constructor(
    updateEquipment: UpdateStationMeasurements,
    userLogs: RegisterUserLogs
  ) {
    this.updateEquipment = updateEquipment;
    this.userLogs = userLogs;
  }

  async handle(
    request: UpdateStationMeasuresControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const dto = {
        IdEquipment: request.id,
        IdRead: request.IdRead,
        Time: request.Time,
        Hour: request.Hour,
        TotalRadiation: request.TotalRadiation,
        AverageRelativeHumidity: request.AverageRelativeHumidity,
        MinRelativeHumidity: request.MinRelativeHumidity,
        MaxRelativeHumidity: request.MaxRelativeHumidity,
        AverageAtmosphericTemperature: request.AverageAtmosphericTemperature,
        MaxAtmosphericTemperature: request.MaxAtmosphericTemperature,
        MinAtmosphericTemperature: request.MinAtmosphericTemperature,
        AtmosphericPressure: request.AtmosphericPressure,
        WindVelocity: request.WindVelocity
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

export namespace UpdateStationMeasuresControllerProtocol {
  export type Request = {
    accountId: number;
    id: number;
    IdRead: number;
    Time: string;
    Hour: number | null;
    TotalRadiation: number | null;
    AverageRelativeHumidity: number | null;
    MinRelativeHumidity: number | null;
    MaxRelativeHumidity: number | null;
    AverageAtmosphericTemperature: number | null;
    MaxAtmosphericTemperature: number | null;
    MinAtmosphericTemperature: number | null;
    AtmosphericPressure: number | null;
    WindVelocity: number | null;
  };
}
