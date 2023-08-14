import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchEconomicSecurityCensusByBasin } from "../../../domain/use-cases/indicators-census/fetch-economic-security-by-basin";
import { ok } from "../helpers";

export class FetchEconomicSecurityCensusByBasinController
  implements Controller<void, HttpResponse>
{
  private fetchEconomicSecurityCensusByBasin: FetchEconomicSecurityCensusByBasin;

  constructor(
    fetchEconomicSecurityCensusByBasin: FetchEconomicSecurityCensusByBasin
  ) {
    this.fetchEconomicSecurityCensusByBasin =
      fetchEconomicSecurityCensusByBasin;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchEconomicSecurityCensusByBasin.execute();

    return ok(result.value);
  }
}
