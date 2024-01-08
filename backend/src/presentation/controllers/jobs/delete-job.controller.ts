import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok } from "../helpers";
import { FetchWorkersCensusByBasin } from "../../../domain/use-cases/workers-census/fetch-workers-census-by-basin";

export class DeleteJobController implements Controller<void, HttpResponse> {
  private fetchWorkersCensusByBasin: FetchWorkersCensusByBasin;

  constructor(fetchWorkersCensusByBasin: FetchWorkersCensusByBasin) {
    this.fetchWorkersCensusByBasin = fetchWorkersCensusByBasin;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchWorkersCensusByBasin.execute();

    return ok(result.value);
  }
}
