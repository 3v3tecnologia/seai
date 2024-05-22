import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { FetchSocialSecurityCensusByBasin } from "../../../../domain/use-cases/indicators-census/fetch-social-security-by-basin";
import { ok } from "../../../../presentation/controllers/helpers";

export class FetchSoilSecurityCensusByBasinController
  implements Controller<void, HttpResponse> {
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
