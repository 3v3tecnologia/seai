import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { ok } from "../../../../presentation/controllers/helpers";
import { FetchCensusLocations } from "../../services/fetch-census-locations";

export class FetchCensusLocationsController
  implements Controller<void, HttpResponse> {
  private fetchCensusLocations: FetchCensusLocations;

  constructor(fetchCensusLocations: FetchCensusLocations) {
    this.fetchCensusLocations = fetchCensusLocations;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchCensusLocations.execute();

    return ok(result.value);
  }
}
