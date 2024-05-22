import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { FetchCensusTakersCensusByBasin } from "../../services/fetch-census-takers-by-basin";
import { ok } from "../../../../presentation/controllers/helpers";

export class FetchCensusTakersByBasinController
  implements Controller<void, HttpResponse> {
  private fetchCensusTakersCensusByBasin: FetchCensusTakersCensusByBasin;

  constructor(fetchCensusTakersCensusByBasin: FetchCensusTakersCensusByBasin) {
    this.fetchCensusTakersCensusByBasin = fetchCensusTakersCensusByBasin;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchCensusTakersCensusByBasin.execute();

    return ok(result.value);
  }
}
