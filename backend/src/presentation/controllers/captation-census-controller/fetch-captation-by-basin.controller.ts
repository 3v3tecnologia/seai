import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchCaptationCensusByBasin } from "../../../domain/use-cases/captation-census/fetch-captation-census-by-basin";
import { ok } from "../helpers";

export class FetchCaptationByBasinController
  implements Controller<void, HttpResponse>
{
  private fetchCaptationCensusByBasin: FetchCaptationCensusByBasin;

  constructor(fetchCaptationCensusByBasin: FetchCaptationCensusByBasin) {
    this.fetchCaptationCensusByBasin = fetchCaptationCensusByBasin;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchCaptationCensusByBasin.execute();

    return ok(result.value);
  }
}
