import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok } from "../helpers";

import { FetchPluviometersReads } from "../../../domain/use-cases/equipments/fetch-pluviometers-reads";

export class FetchPluviometersReadsController
  implements
    Controller<
      FetchPluviometersMeasuresControllerProtocol.Request,
      HttpResponse
    >
{
  private fetchPluviometersReads: FetchPluviometersReads;

  constructor(fetchPluviometersReads: FetchPluviometersReads) {
    this.fetchPluviometersReads = fetchPluviometersReads;
  }

  async handle(
    request: FetchPluviometersMeasuresControllerProtocol.Request
  ): Promise<HttpResponse> {
    const result = await this.fetchPluviometersReads.execute(request);

    return ok(result.value);
  }
}

export namespace FetchPluviometersMeasuresControllerProtocol {
  export type Request = {
    idEquipment: number;
    pageNumber: number;
  };
}
