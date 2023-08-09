import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchCaptationCensusByCounty } from "../../../domain/use-cases/captation-census/fetch-captation-census-by-county";
import { ok } from "../helpers";

export class FetchCaptationByCountyController
  implements Controller<void, HttpResponse>
{
  private fetchCaptationCensusByCounty: FetchCaptationCensusByCounty;

  constructor(fetchCaptationCensusByCounty: FetchCaptationCensusByCounty) {
    this.fetchCaptationCensusByCounty = fetchCaptationCensusByCounty;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchCaptationCensusByCounty.execute();

    return ok(result.value);
  }
}
