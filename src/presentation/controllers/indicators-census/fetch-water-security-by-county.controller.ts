import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchWaterSecurityCensusByCounty } from "../../../domain/use-cases/indicators-census/fetch-water-security-by-county";
import { ok } from "../helpers";

export class FetchWaterSecurityCensusByCountyController
  implements Controller<void, HttpResponse>
{
  private fetchWaterSecurityCensusByCounty: FetchWaterSecurityCensusByCounty;

  constructor(
    fetchWaterSecurityCensusByCounty: FetchWaterSecurityCensusByCounty
  ) {
    this.fetchWaterSecurityCensusByCounty = fetchWaterSecurityCensusByCounty;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchWaterSecurityCensusByCounty.execute();

    return ok(result.value);
  }
}
