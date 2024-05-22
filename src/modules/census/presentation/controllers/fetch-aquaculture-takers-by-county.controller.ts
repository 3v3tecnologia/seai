import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { FetchAquacultureCensusByCounty } from "../../services/fetch-aquaculture-by-county";
import { ok } from "../../../../presentation/controllers/helpers";

export class FetchAquacultureByCountyController
  implements Controller<void, HttpResponse> {
  private fetchAquacultureCensusByCounty: FetchAquacultureCensusByCounty;

  constructor(fetchAquacultureCensusByCounty: FetchAquacultureCensusByCounty) {
    this.fetchAquacultureCensusByCounty = fetchAquacultureCensusByCounty;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchAquacultureCensusByCounty.execute();

    return ok(result.value);
  }
}
