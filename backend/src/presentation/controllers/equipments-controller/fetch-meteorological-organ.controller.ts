import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchStationsReads } from "../../../domain/use-cases/equipments/fetch-stations-reads";
import { ok, serverError } from "../helpers";
import { FetchMeteorologicalOrgans } from "../../../domain/use-cases/equipments/fetch-meteorologial-organs";

export class FetchMeteorologicalOrganController
  implements
    Controller<
      FetchMeteorologicalOrganControllerProtocol.Request,
      HttpResponse
    >
{
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
