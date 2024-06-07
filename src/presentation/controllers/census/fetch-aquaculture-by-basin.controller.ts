import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok, serverError } from "../helpers";
import { FetchAquacultureCensusByBasin } from "../../../domain/use-cases/census";

export class FetchAquacultureByBasinController
  implements Controller<void, HttpResponse> {
  private fetchAquacultureCensusByBasin: FetchAquacultureCensusByBasin;

  constructor(fetchAquacultureCensusByBasin: FetchAquacultureCensusByBasin) {
    this.fetchAquacultureCensusByBasin = fetchAquacultureCensusByBasin;
  }

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.fetchAquacultureCensusByBasin.execute();

      return ok(result.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
