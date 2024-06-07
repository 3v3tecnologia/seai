import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok, serverError } from "../helpers";
import { FetchCensusLocations } from "../../../domain/use-cases/indicators-census/fetch-census-locations";

export class FetchCensusLocationsController
  implements Controller<void, HttpResponse> {
  private fetchCensusLocations: FetchCensusLocations;

  constructor(fetchCensusLocations: FetchCensusLocations) {
    this.fetchCensusLocations = fetchCensusLocations;
  }

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.fetchCensusLocations.execute();

      return ok(result.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
