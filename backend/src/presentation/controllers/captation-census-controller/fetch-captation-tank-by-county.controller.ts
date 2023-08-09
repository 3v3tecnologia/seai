import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchCaptationTankCensusByCounty } from "../../../domain/use-cases/captation-census/fetch-captation-tank-census-by-county";
import { ok } from "../helpers";

export class FetchCaptationTankByCountyController
  implements Controller<void, HttpResponse>
{
  private fetchCaptationTankCensusByCounty: FetchCaptationTankCensusByCounty;

  constructor(
    fetchCaptationTankCensusByCounty: FetchCaptationTankCensusByCounty
  ) {
    this.fetchCaptationTankCensusByCounty = fetchCaptationTankCensusByCounty;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchCaptationTankCensusByCounty.execute();

    return ok(result.value);
  }
}
