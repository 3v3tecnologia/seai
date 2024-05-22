import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { FetchEconomicSecurityCensusByBasin } from "../../services/fetch-economic-security-by-basin";
import { ok } from "../../../../presentation/controllers/helpers";

export class FetchEconomicSecurityCensusByBasinController
  implements Controller<void, HttpResponse> {
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
