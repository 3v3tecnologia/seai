import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok } from "../helpers";
import { FetchCaptationTankCensusByCounty } from "../../../domain/use-cases/census";

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
