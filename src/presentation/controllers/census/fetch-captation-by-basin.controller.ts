import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchCaptationCensusByBasin } from "../../../domain/use-cases/census/fetch-captation-by-basin";
import { ok, serverError } from "../helpers";

export class FetchCaptationByBasinController
  implements Controller<void, HttpResponse> {
  private fetchCaptationCensusByBasin: FetchCaptationCensusByBasin;

  constructor(fetchCaptationCensusByBasin: FetchCaptationCensusByBasin) {
    this.fetchCaptationCensusByBasin = fetchCaptationCensusByBasin;
  }

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.fetchCaptationCensusByBasin.execute();

      return ok(result.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
