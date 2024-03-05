import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok } from "../helpers";
import { FetchCensusLocations } from "../../../domain/use-cases/indicators-census/fetch-census-locations";

export class FetchCensusLocationsController
  implements Controller<void, HttpResponse>
{
  private fetchCensusLocations: FetchCensusLocations;

  constructor(fetchCensusLocations: FetchCensusLocations) {
    this.fetchCensusLocations = fetchCensusLocations;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchCensusLocations.execute();

    return ok(result.value);
  }
}
