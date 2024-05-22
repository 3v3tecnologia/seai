import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { FetchStationsReads } from "../../services/fetch-stations-reads";
import { ok, serverError } from "../../../../presentation/controllers/helpers";
import { FetchMeteorologicalOrgans } from "../../services/fetch-meteorologial-organs";

export class FetchMeteorologicalOrganController
  implements
  Controller<
    FetchMeteorologicalOrganControllerProtocol.Request,
    HttpResponse
  > {
  private fetchMeteorologicalOrgans: FetchMeteorologicalOrgans;

  constructor(fetchMeteorologicalOrgans: FetchMeteorologicalOrgans) {
    this.fetchMeteorologicalOrgans = fetchMeteorologicalOrgans;
  }

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.fetchMeteorologicalOrgans.execute();

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchMeteorologicalOrganControllerProtocol {
  export type Request = void;
}
