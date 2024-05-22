import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { FetchCensusTakersCensusByCounty } from "../../services/fetch-census-takers-by-county";
import { ok } from "../../../../presentation/controllers/helpers";

export class FetchCensusTakersByCountyController
  implements Controller<void, HttpResponse> {
  private fetchCensusTakersCensusByCounty: FetchCensusTakersCensusByCounty;

  constructor(
    fetchCensusTakersCensusByCounty: FetchCensusTakersCensusByCounty
  ) {
    this.fetchCensusTakersCensusByCounty = fetchCensusTakersCensusByCounty;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchCensusTakersCensusByCounty.execute();

    return ok(result.value);
  }
}
