import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { UpdateStationMeasurements } from "../../../domain/use-cases/equipments/update-station-measures";
import { ISchemaValidator } from "../../../shared/validation/validator";
import { badRequest, ok, serverError } from "../helpers";
import { UserOperationControllerDTO } from "../../../@types/login-user";

export class UpdateStationMeasuresController
  implements
    Controller<UpdateStationMeasuresControllerProtocol.Request, HttpResponse>
{
  private updateEquipment: UpdateStationMeasurements;
  private validator: ISchemaValidator;

  constructor(
    updateEquipment: UpdateStationMeasurements,
    validator: ISchemaValidator
  ) {
    this.updateEquipment = updateEquipment;
    this.validator = validator;
  }

  async handle({
    AtmosphericPressure,
    AverageAtmosphericTemperature,
    AverageRelativeHumidity,
    MaxAtmosphericTemperature,
    MaxRelativeHumidity,
    MinAtmosphericTemperature,
    MinRelativeHumidity,
    Operation,
    TotalRadiation,
    WindVelocity,
    accountId,
    id,
  }: UpdateStationMeasuresControllerProtocol.Request): Promise<HttpResponse> {
    try {
      const measurements = {
        AtmosphericPressure,
        AverageAtmosphericTemperature,
        AverageRelativeHumidity,
        MaxAtmosphericTemperature,
        MaxRelativeHumidity,
        MinAtmosphericTemperature,
        MinRelativeHumidity,
        TotalRadiation,
        WindVelocity,
      };
      const { error } = await this.validator.validate({
        id,
        ...measurements,
      });

      if (error) {
        return badRequest(error);
      }

      const resultOrError = await this.updateEquipment.execute(
        {
          IdRead: Number(id),
          ...measurements,
        },
        {
          author: accountId,
          operation: Operation,
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

export namespace UpdateStationMeasuresControllerProtocol {
  export type Request = {
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
  } & UserOperationControllerDTO;
}
