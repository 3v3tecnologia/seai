import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok, serverError } from "../helpers";
import { FetchWorkersCensusByBasin } from "../../../domain/use-cases/census/fetch-workers-by-basin";

export class FetchWorkersByBasinController
  implements Controller<void, HttpResponse> {
  private fetchWorkersCensusByBasin: FetchWorkersCensusByBasin;

  constructor(fetchWorkersCensusByBasin: FetchWorkersCensusByBasin) {
    this.fetchWorkersCensusByBasin = fetchWorkersCensusByBasin;
  }

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.fetchWorkersCensusByBasin.execute();

      return ok(result.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
