import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchStationReadsWithLastMeasurementsProtocol } from "../../../domain/use-cases/equipments/fetch-stations-with-last-measurements";
import { ok, serverError } from "../helpers";
import { FetchPluviometersReadsWithLastMeasurementsProtocol } from "../../../domain/use-cases/equipments/fetch-pluviometers-with-last-measurements";

export class FetchPluviometersWithLastMeasurementsController
  implements
    Controller<
      FetchPluviometersWithLastMeasurementsControllerProtocol.Request,
      HttpResponse
    >
{
  private useCase: FetchPluviometersReadsWithLastMeasurementsProtocol.UseCase;

  constructor(
    useCase: FetchPluviometersReadsWithLastMeasurementsProtocol.UseCase
  ) {
    this.useCase = useCase;
  }

  async handle(
    request: FetchPluviometersWithLastMeasurementsControllerProtocol.Request
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

export namespace FetchPluviometersWithLastMeasurementsControllerProtocol {
  export type Request = {
    id: number;
  };
}
