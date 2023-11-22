import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok, badRequest, serverError } from "../helpers";
import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { UpdateStationMeasures } from "../../../domain/use-cases/equipments/update-station-measures";

export class UpdateStationMeasuresController
  implements
    Controller<UpdateStationMeasuresControllerProtocol.Request, HttpResponse>
{
  private updateEquipment: UpdateStationMeasures;
  private userLogs: RegisterUserLogs;

  constructor(updateEquipment: UpdateStationMeasures, userLogs: RegisterUserLogs) {
    this.updateEquipment = updateEquipment;
    this.userLogs = userLogs;
  }

  async handle(
    request: UpdateStationMeasuresControllerProtocol.Request
  ): Promise<HttpResponse> {
    try { 
      const dto = {
        IdRead: request.id,
        TotalRadiation: request.TotalRadiation,
        AverageRelativeHumidity: request.AverageRelativeHumidity,
        MinRelativeHumidity: request.MinRelativeHumidity,
        MaxRelativeHumidity: request.MaxRelativeHumidity,
        AverageAtmosphericTemperature: request.AverageAtmosphericTemperature,
        MaxAtmosphericTemperature: request.MaxAtmosphericTemperature,
        MinAtmosphericTemperature: request.MinAtmosphericTemperature,
        AtmosphericPressure:request.AtmosphericPressure,
        ETO: request.ETO
      }

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
    TotalRadiation: number | null;
    AverageRelativeHumidity: number | null;
    MinRelativeHumidity: number | null;
    MaxRelativeHumidity: number | null;
    AverageAtmosphericTemperature: number | null;
    MaxAtmosphericTemperature: number | null;
    MinAtmosphericTemperature: number | null;
    AtmosphericPressure: number | null;
    ETO: number | null;
  };
}
