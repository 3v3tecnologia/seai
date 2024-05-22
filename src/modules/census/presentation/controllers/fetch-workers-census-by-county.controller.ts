import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { ok } from "../../../../presentation/controllers/helpers";
import { FetchWorkersCensusByCounty } from "../../../../domain/use-cases/census/fetch-workers-by-county";

export class FetchWorkersByCountyController
  implements Controller<void, HttpResponse> {
  private fetchWorkersCensusByCounty: FetchWorkersCensusByCounty;

  constructor(fetchWorkersCensusByCounty: FetchWorkersCensusByCounty) {
    this.fetchWorkersCensusByCounty = fetchWorkersCensusByCounty;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchWorkersCensusByCounty.execute();

    return ok(result.value);
  }
}
