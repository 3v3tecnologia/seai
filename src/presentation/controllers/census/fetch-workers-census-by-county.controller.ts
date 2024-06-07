import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok, serverError } from "../helpers";
import { FetchWorkersCensusByCounty } from "../../../domain/use-cases/census/fetch-workers-by-county";

export class FetchWorkersByCountyController
  implements Controller<void, HttpResponse> {
  private fetchWorkersCensusByCounty: FetchWorkersCensusByCounty;

  constructor(fetchWorkersCensusByCounty: FetchWorkersCensusByCounty) {
    this.fetchWorkersCensusByCounty = fetchWorkersCensusByCounty;
  }

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.fetchWorkersCensusByCounty.execute();

      return ok(result.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
