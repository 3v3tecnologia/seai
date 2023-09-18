import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok } from "../helpers";
import { FetchStationsReads } from "../../../domain/use-cases/equipments/fetch-stations-reads";

export class FetchStationsReadsController
  implements Controller<void, HttpResponse>
{
  private fetchStationsReads: FetchStationsReads;

  constructor(fetchStationsReads: FetchStationsReads) {
    this.fetchStationsReads = fetchStationsReads;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchStationsReads.execute();

    return ok(result.value);
  }
}
