import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchWaterSecurityCensusByBasin } from "../../../domain/use-cases/indicators-census/fetch-water-security-by-basin";
import { ok } from "../helpers";

export class FetchWaterSecurityCensusByBasinController
  implements Controller<void, HttpResponse>
{
  private fetchWaterSecurityCensusByBasin: FetchWaterSecurityCensusByBasin;

  constructor(
    fetchWaterSecurityCensusByBasin: FetchWaterSecurityCensusByBasin
  ) {
    this.fetchWaterSecurityCensusByBasin = fetchWaterSecurityCensusByBasin;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchWaterSecurityCensusByBasin.execute();

    return ok(result.value);
  }
}
