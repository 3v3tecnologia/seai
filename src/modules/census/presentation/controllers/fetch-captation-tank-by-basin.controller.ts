import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { FetchCaptationTankCensusByBasin } from "../../services/fetch-captation-tank-by-basin";
import { ok } from "../../../../presentation/controllers/helpers";

export class FetchCaptationTankByBasinController
  implements Controller<void, HttpResponse> {
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
