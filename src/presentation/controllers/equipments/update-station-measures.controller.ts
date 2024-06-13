import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok, badRequest, serverError } from "../helpers";
import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { UpdateStationMeasurements } from "../../../domain/use-cases/equipments/update-station-measures";
import { ISchemaValidator } from "../../../shared/validation/validator";

export class UpdateStationMeasuresController
  implements
  Controller<UpdateStationMeasuresControllerProtocol.Request, HttpResponse> {
  private updateEquipment: UpdateStationMeasurements;
  private userLogs: RegisterUserLogs;
  private validator: ISchemaValidator;

  constructor(
    updateEquipment: UpdateStationMeasurements,
    userLogs: RegisterUserLogs,
    validator: ISchemaValidator,
  ) {
    this.updateEquipment = updateEquipment;
    this.userLogs = userLogs;
    this.validator = validator;
  }

  async handle(
    request: UpdateStationMeasuresControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const { error } = await this.validator.validate({
        id: request.id,
        TotalRadiation: request.TotalRadiation,
        AverageRelativeHumidity: request.AverageRelativeHumidity,
        MinRelativeHumidity: request.MinRelativeHumidity,
        MaxRelativeHumidity: request.MaxRelativeHumidity,
        AverageAtmosphericTemperature: request.AverageAtmosphericTemperature,
        MaxAtmosphericTemperature: request.MaxAtmosphericTemperature,
        MinAtmosphericTemperature: request.MinAtmosphericTemperature,
        AtmosphericPressure: request.AtmosphericPressure,
        WindVelocity: request.WindVelocity
      });


      if (error) {
        return badRequest(error)
      }


      const resultOrError = await this.updateEquipment.execute({
        IdRead: Number(request.id),
        TotalRadiation: request.TotalRadiation,
        AverageRelativeHumidity: request.AverageRelativeHumidity,
        MinRelativeHumidity: request.MinRelativeHumidity,
        MaxRelativeHumidity: request.MaxRelativeHumidity,
        AverageAtmosphericTemperature: request.AverageAtmosphericTemperature,
        MaxAtmosphericTemperature: request.MaxAtmosphericTemperature,
        MinAtmosphericTemperature: request.MinAtmosphericTemperature,
        AtmosphericPressure: request.AtmosphericPressure,
        WindVelocity: request.WindVelocity
      });

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
    WindVelocity: number | null;
  };
}
