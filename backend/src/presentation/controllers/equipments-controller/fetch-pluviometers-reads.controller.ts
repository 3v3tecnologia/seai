import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok } from "../helpers";

import { FetchPluviometersReads } from "../../../domain/use-cases/equipments/fetch-pluviometers-reads";

export class FetchPluviometersReadsController
  implements Controller<void, HttpResponse>
{
  private fetchPluviometersReads: FetchPluviometersReads;

  constructor(fetchPluviometersReads: FetchPluviometersReads) {
    this.fetchPluviometersReads = fetchPluviometersReads;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchPluviometersReads.execute();

    return ok(result.value);
  }
}
