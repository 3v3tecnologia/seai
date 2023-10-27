import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok } from "../helpers";
import { FetchStationsReads } from "../../../domain/use-cases/equipments/fetch-stations-reads";

export class FetchStationsReadsController
  implements
    Controller<FetchStationsMeasuresControllerProtocol.Request, HttpResponse>
{
  private fetchStationsReads: FetchStationsReads;

  constructor(fetchStationsReads: FetchStationsReads) {
    this.fetchStationsReads = fetchStationsReads;
  }

  async handle(
    request: FetchStationsMeasuresControllerProtocol.Request
  ): Promise<HttpResponse> {
    const result = await this.fetchStationsReads.execute(request);

    return ok(result.value);
  }
}

export namespace FetchStationsMeasuresControllerProtocol {
  export type Request = {
    idEquipment: number;
    pageNumber: number;
  };
}
