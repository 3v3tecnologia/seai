import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchCaptationTankCensusByBasin } from "../../../domain/use-cases/census/fetch-captation-tank-by-basin";
import { ok } from "../helpers";

export class FetchCaptationTankByBasinController
  implements Controller<void, HttpResponse>
{
  private fetchCaptationTankCensusByBasin: FetchCaptationTankCensusByBasin;

  constructor(
    fetchCaptationTankCensusByBasin: FetchCaptationTankCensusByBasin
  ) {
    this.fetchCaptationTankCensusByBasin = fetchCaptationTankCensusByBasin;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchCaptationTankCensusByBasin.execute();

    return ok(result.value);
  }
}
