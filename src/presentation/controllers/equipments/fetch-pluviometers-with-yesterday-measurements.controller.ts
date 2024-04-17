import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok, serverError } from "../helpers";
import { FetchPluviometersWithYesterdayMeasurementsProtocol } from "../../../domain/use-cases/equipments";

export class FetchPluviometersWithYesterdayMeasurementsController
  implements
    Controller<
      FetchPluviometersWithYesterdayMeasurementsControllerProtocol.Request,
      HttpResponse
    >
{
  private useCase: FetchPluviometersWithYesterdayMeasurementsProtocol.UseCase;

  constructor(
    useCase: FetchPluviometersWithYesterdayMeasurementsProtocol.UseCase
  ) {
    this.useCase = useCase;
  }

  async handle(
    request: FetchPluviometersWithYesterdayMeasurementsControllerProtocol.Request
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

export namespace FetchPluviometersWithYesterdayMeasurementsControllerProtocol {
  export type Request = {
    latitude: number;
    longitude: number;
    distance: number;
  } | null;
}
