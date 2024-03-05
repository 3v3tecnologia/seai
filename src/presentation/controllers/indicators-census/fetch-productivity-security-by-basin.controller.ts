import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchProductivitySecurityCensusByBasin } from "../../../domain/use-cases/indicators-census/fetch-productivity-security-by-basin";
import { ok } from "../helpers";

export class FetchProductivitySecurityCensusByBasinController
  implements Controller<void, HttpResponse>
{
  private fetchProductivitySecurityCensusByBasin: FetchProductivitySecurityCensusByBasin;

  constructor(
    fetchProductivitySecurityCensusByBasin: FetchProductivitySecurityCensusByBasin
  ) {
    this.fetchProductivitySecurityCensusByBasin =
      fetchProductivitySecurityCensusByBasin;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchProductivitySecurityCensusByBasin.execute();

    return ok(result.value);
  }
}
