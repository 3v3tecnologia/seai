import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchLatestStationMeasurements } from "../../../domain/use-cases/equipments";
import { Notification } from "../../../shared/notification/notification";
import { badRequest, ok, serverError } from "../helpers";

export class FetchLatestStationMeasurementsController
  implements
    Controller<
      FetchLatestStationMeasurementsControllerProtocol.Request,
      HttpResponse
    >
{
  private fetchStationsReads: FetchLatestStationMeasurements;

  constructor(fetchStationsReads: FetchLatestStationMeasurements) {
    this.fetchStationsReads = fetchStationsReads;
  }

  async handle(
    request: FetchLatestStationMeasurementsControllerProtocol.Request
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

      if (errors.hasErrors()) {
        return badRequest(new Error(errors.messages()));
      }

      const dto = {
        id: request.id,
      };

      const result = await this.fetchStationsReads.execute(dto);

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchLatestStationMeasurementsControllerProtocol {
  export type Request = {
    id: number;
  };
}
