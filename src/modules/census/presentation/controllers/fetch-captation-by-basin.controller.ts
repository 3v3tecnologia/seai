import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { FetchCaptationCensusByBasin } from "../../services/fetch-captation-by-basin";
import { ok } from "../../../../presentation/controllers/helpers";

export class FetchCaptationByBasinController
  implements Controller<void, HttpResponse> {
  private fetchCaptationCensusByBasin: FetchCaptationCensusByBasin;

  constructor(fetchCaptationCensusByBasin: FetchCaptationCensusByBasin) {
    this.fetchCaptationCensusByBasin = fetchCaptationCensusByBasin;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchCaptationCensusByBasin.execute();

    return ok(result.value);
  }
}
