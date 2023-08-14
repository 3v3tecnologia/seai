import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchAquacultureCensusByBasin } from "../../../domain/use-cases/aquaculture-census/fetch-aquaculture-census-by-basin";
import { ok } from "../helpers";

export class FetchAquacultureByBasinController
  implements Controller<void, HttpResponse>
{
  private fetchAquacultureCensusByBasin: FetchAquacultureCensusByBasin;

  constructor(fetchAquacultureCensusByBasin: FetchAquacultureCensusByBasin) {
    this.fetchAquacultureCensusByBasin = fetchAquacultureCensusByBasin;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchAquacultureCensusByBasin.execute();

    return ok(result.value);
  }
}
