import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchProductivitySecurityCensusByCounty } from "../../../domain/use-cases/indicators-census/fetch-productivity-security-by-county";
import { ok } from "../helpers";

export class FetchProductivitySecurityCensusByCountyController
  implements Controller<void, HttpResponse>
{
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
