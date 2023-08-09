import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchEconomicSecurityCensusByCounty } from "../../../domain/use-cases/indicators-census/fetch-economic-security-by-county";
import { ok } from "../helpers";

export class FetchEconomicSecurityCensusByCountyController
  implements Controller<void, HttpResponse>
{
  private fetchEconomicSecurityCensusByCounty: FetchEconomicSecurityCensusByCounty;

  constructor(
    fetchEconomicSecurityCensusByCounty: FetchEconomicSecurityCensusByCounty
  ) {
    this.fetchEconomicSecurityCensusByCounty =
      fetchEconomicSecurityCensusByCounty;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchEconomicSecurityCensusByCounty.execute();

    return ok(result.value);
  }
}
