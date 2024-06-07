import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchCaptationCensusByCounty } from "../../../domain/use-cases/census/fetch-captation-by-county";
import { ok, serverError } from "../helpers";

export class FetchCaptationByCountyController
  implements Controller<void, HttpResponse> {
  private fetchCaptationCensusByCounty: FetchCaptationCensusByCounty;

  constructor(fetchCaptationCensusByCounty: FetchCaptationCensusByCounty) {
    this.fetchCaptationCensusByCounty = fetchCaptationCensusByCounty;
  }

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.fetchCaptationCensusByCounty.execute();

      return ok(result.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
