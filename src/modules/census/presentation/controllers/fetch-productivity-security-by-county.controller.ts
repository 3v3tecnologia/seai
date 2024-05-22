import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { FetchProductivitySecurityCensusByCounty } from "../../services/fetch-productivity-security-by-county";
import { ok } from "../../../../presentation/controllers/helpers";

export class FetchProductivitySecurityCensusByCountyController
  implements Controller<void, HttpResponse> {
  private fetchProductivitySecurityCensusByCounty: FetchProductivitySecurityCensusByCounty;

  constructor(
    fetchProductivitySecurityCensusByCounty: FetchProductivitySecurityCensusByCounty
  ) {
    this.fetchProductivitySecurityCensusByCounty =
      fetchProductivitySecurityCensusByCounty;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchProductivitySecurityCensusByCounty.execute();

    return ok(result.value);
  }
}
