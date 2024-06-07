import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchAquacultureCensusByCounty } from "../../../domain/use-cases/census/fetch-aquaculture-by-county";
import { ok, serverError } from "../helpers";

export class FetchAquacultureByCountyController
  implements Controller<void, HttpResponse> {
  private fetchAquacultureCensusByCounty: FetchAquacultureCensusByCounty;

  constructor(fetchAquacultureCensusByCounty: FetchAquacultureCensusByCounty) {
    this.fetchAquacultureCensusByCounty = fetchAquacultureCensusByCounty;
  }

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.fetchAquacultureCensusByCounty.execute();

      return ok(result.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
