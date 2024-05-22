import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchSocialSecurityCensusByCounty } from "../../../domain/use-cases/indicators-census/fetch-social-security-by-county";
import { ok } from "../helpers";

export class FetchSoilSecurityCensusByCountyController
  implements Controller<void, HttpResponse>
{
  private fetchSoilSecurityCensusByCounty: FetchSocialSecurityCensusByCounty;

  constructor(
    fetchSoilSecurityCensusByCounty: FetchSocialSecurityCensusByCounty
  ) {
    this.fetchSoilSecurityCensusByCounty = fetchSoilSecurityCensusByCounty;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchSoilSecurityCensusByCounty.execute();

    return ok(result.value);
  }
}
