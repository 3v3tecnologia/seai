import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchLatestPluviometerMeasurements } from "../../../domain/use-cases/equipments";
import { Notification } from "../../../shared/notification/notification";
import { badRequest, ok, serverError } from "../helpers";

export class FetchLatestPluviometerMeasurementsController
  implements
    Controller<
      FetchLatestPluviometerMeasurementsControllerProtocol.Request,
      HttpResponse
    >
{
  private fetchMeasurements: FetchLatestPluviometerMeasurements;

  constructor(fetchStationsReads: FetchLatestPluviometerMeasurements) {
    this.fetchMeasurements = fetchStationsReads;
  }

  async handle(
    request: FetchLatestPluviometerMeasurementsControllerProtocol.Request
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

      const result = await this.fetchMeasurements.execute(dto);

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchLatestPluviometerMeasurementsControllerProtocol {
  export type Request = {
    id: number;
  };
}
