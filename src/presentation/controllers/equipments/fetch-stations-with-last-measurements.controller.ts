import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchStationReadsWithLastMeasurementsProtocol } from "../../../domain/use-cases/equipments/fetch-stations-with-last-measurements";
import { ok, serverError } from "../helpers";

export class FetchStationsWithLastMeasurementsController
  implements
    Controller<
      FetchStationsWithLastMeasurementsControllerProtocol.Request,
      HttpResponse
    >
{
  private useCase: FetchStationReadsWithLastMeasurementsProtocol.UseCase;

  constructor(useCase: FetchStationReadsWithLastMeasurementsProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: FetchStationsWithLastMeasurementsControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const result = await this.useCase.execute();

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchStationsWithLastMeasurementsControllerProtocol {
  export type Request = {
    id: number;
  };
}
