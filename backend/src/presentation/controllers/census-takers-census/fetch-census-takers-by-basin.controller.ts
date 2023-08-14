import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchCensusTakersCensusByBasin } from "../../../domain/use-cases/census-takers/fetch-census-takers-by-basin";
import { ok } from "../helpers";

export class FetchCensusTakersByBasinController
  implements Controller<void, HttpResponse>
{
  private fetchCensusTakersCensusByBasin: FetchCensusTakersCensusByBasin;

  constructor(fetchCensusTakersCensusByBasin: FetchCensusTakersCensusByBasin) {
    this.fetchCensusTakersCensusByBasin = fetchCensusTakersCensusByBasin;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchCensusTakersCensusByBasin.execute();

    return ok(result.value);
  }
}
