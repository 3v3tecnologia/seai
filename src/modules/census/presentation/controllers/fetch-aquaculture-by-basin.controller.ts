import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { ok } from "../../../../presentation/controllers/helpers";
import { FetchAquacultureCensusByBasin } from "../../../../domain/use-cases/census";

export class FetchAquacultureByBasinController
  implements Controller<void, HttpResponse> {
  private fetchAquacultureCensusByBasin: FetchAquacultureCensusByBasin;

  constructor(fetchAquacultureCensusByBasin: FetchAquacultureCensusByBasin) {
    this.fetchAquacultureCensusByBasin = fetchAquacultureCensusByBasin;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchAquacultureCensusByBasin.execute();

    return ok(result.value);
  }
}
