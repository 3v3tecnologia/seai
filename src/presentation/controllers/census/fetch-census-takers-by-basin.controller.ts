import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchCensusTakersCensusByBasin } from "../../../domain/use-cases/census/fetch-census-takers-by-basin";
import { ok, serverError } from "../helpers";

export class FetchCensusTakersByBasinController
  implements Controller<void, HttpResponse> {
  private fetchCensusTakersCensusByBasin: FetchCensusTakersCensusByBasin;

  constructor(fetchCensusTakersCensusByBasin: FetchCensusTakersCensusByBasin) {
    this.fetchCensusTakersCensusByBasin = fetchCensusTakersCensusByBasin;
  }

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.fetchCensusTakersCensusByBasin.execute();

      return ok(result.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
