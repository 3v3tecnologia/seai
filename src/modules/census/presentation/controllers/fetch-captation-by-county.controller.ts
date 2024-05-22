import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { FetchCaptationCensusByCounty } from "../../services/fetch-captation-by-county";
import { ok } from "../../../../presentation/controllers/helpers";

export class FetchCaptationByCountyController
  implements Controller<void, HttpResponse> {
  private fetchCaptationCensusByCounty: FetchCaptationCensusByCounty;

  constructor(fetchCaptationCensusByCounty: FetchCaptationCensusByCounty) {
    this.fetchCaptationCensusByCounty = fetchCaptationCensusByCounty;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchCaptationCensusByCounty.execute();

    return ok(result.value);
  }
}
