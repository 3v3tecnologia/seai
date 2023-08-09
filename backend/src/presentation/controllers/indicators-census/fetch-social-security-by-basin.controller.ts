import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchSocialSecurityCensusByBasin } from "../../../domain/use-cases/indicators-census/fetch-social-security-by-basin";
import { ok } from "../helpers";

export class FetchSoilSecurityCensusByBasinController
  implements Controller<void, HttpResponse>
{
  private fetchSoilSecurityCensusByBasin: FetchSocialSecurityCensusByBasin;

  constructor(
    fetchSoilSecurityCensusByBasin: FetchSocialSecurityCensusByBasin
  ) {
    this.fetchSoilSecurityCensusByBasin = fetchSoilSecurityCensusByBasin;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchSoilSecurityCensusByBasin.execute();

    return ok(result.value);
  }
}
