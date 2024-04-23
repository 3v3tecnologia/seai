import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchLatestEquipmentMeasurementsProtocol } from "../../../domain/use-cases/equipments";
import { Notification } from "../../../shared/notification/notification";
import { badRequest, ok, serverError } from "../helpers";

export class FetchLatestEquipmentMeasurementsController
  implements
    Controller<
      FetchLatestEquipmentMeasurementsControllerProtocol.Request,
      HttpResponse
    >
{
  private fetchLatestEquipmentMeasurements: FetchLatestEquipmentMeasurementsProtocol.UseCase;

  constructor(
    fetchLatestEquipmentMeasurements: FetchLatestEquipmentMeasurementsProtocol.UseCase
  ) {
    this.fetchLatestEquipmentMeasurements = fetchLatestEquipmentMeasurements;
  }

  async handle(
    request: FetchLatestEquipmentMeasurementsControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const errors = new Notification();

      if (request.id === undefined || request.id === null) {
        errors.addError(
          new Error(
            "É necessário informar o Id da leitura do equipamento, e o valor deve ser numérico"
          )
        );
      }

      if (request.type === undefined || request.type === null) {
        errors.addError(
          new Error(
            "É necessário informar o tipo de equipamento e o valor deve ser 'station' ou 'pluviometer'"
          )
        );
      }

      if (errors.hasErrors()) {
        return badRequest(new Error(errors.messages()));
      }

      const result = await this.fetchLatestEquipmentMeasurements.execute({
        id: request.id,
        type: request.type,
      });

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchLatestEquipmentMeasurementsControllerProtocol {
  export type Request = {
    id: number;
    type: "station" | "pluviometer";
  };
}
