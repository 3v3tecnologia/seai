import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { ok } from "../../../../presentation/controllers/helpers";
import { FetchWorkersCensusByBasin } from "../../../../domain/use-cases/census/fetch-workers-by-basin";

export class FetchWorkersByBasinController
  implements Controller<void, HttpResponse> {
  private fetchWorkersCensusByBasin: FetchWorkersCensusByBasin;

  constructor(fetchWorkersCensusByBasin: FetchWorkersCensusByBasin) {
    this.fetchWorkersCensusByBasin = fetchWorkersCensusByBasin;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchWorkersCensusByBasin.execute();

    return ok(result.value);
  }
}
