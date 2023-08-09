import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchAquacultureCensusByCounty } from "../../../domain/use-cases/aquaculture-census/fetch-aquaculture-census-by-county";
import { ok } from "../helpers";

export class FetchAquacultureByCountyController
  implements Controller<void, HttpResponse>
{
  private fetchAquacultureCensusByCounty: FetchAquacultureCensusByCounty;

  constructor(fetchAquacultureCensusByCounty: FetchAquacultureCensusByCounty) {
    this.fetchAquacultureCensusByCounty = fetchAquacultureCensusByCounty;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchAquacultureCensusByCounty.execute();

    return ok(result.value);
  }
}
