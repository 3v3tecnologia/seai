import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchCensusTakersCensusByCounty } from "../../../domain/use-cases/census/fetch-census-takers-by-county";
import { ok, serverError } from "../helpers";

export class FetchCensusTakersByCountyController
  implements Controller<void, HttpResponse> {
  private fetchCensusTakersCensusByCounty: FetchCensusTakersCensusByCounty;

  constructor(
    fetchCensusTakersCensusByCounty: FetchCensusTakersCensusByCounty
  ) {
    this.fetchCensusTakersCensusByCounty = fetchCensusTakersCensusByCounty;
  }

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.fetchCensusTakersCensusByCounty.execute();

      return ok(result.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
