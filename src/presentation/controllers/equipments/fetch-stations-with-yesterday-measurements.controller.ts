import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchStationsWithYesterdayMeasurementsProtocol } from "../../../domain/use-cases/equipments";
import { ok, serverError } from "../helpers";

export class FetchStationsWithYesterdayMeasurementsController
  implements
    Controller<
      FetchStationsWithYesterdayMeasurementsControllerProtocol.Request,
      HttpResponse
    >
{
  private useCase: FetchStationsWithYesterdayMeasurementsProtocol.UseCase;

  constructor(useCase: FetchStationsWithYesterdayMeasurementsProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: FetchStationsWithYesterdayMeasurementsControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const result = await this.useCase.execute(request);

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchStationsWithYesterdayMeasurementsControllerProtocol {
  export type Request = {
    latitude: number;
    longitude: number;
    distance: number;
  } | null;
}
