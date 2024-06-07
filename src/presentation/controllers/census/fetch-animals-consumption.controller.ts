import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchAnimalsCensusByConsumption } from "../../../domain/use-cases/census/fetch-animals-by-consumption";
import { ok, serverError } from "../helpers";

export class FetchAnimalsConsumptionCensusController
  implements Controller<void, HttpResponse> {
  private fetchAnimalsCensusByConsumption: FetchAnimalsCensusByConsumption;

  constructor(
    fetchAnimalsCensusByConsumption: FetchAnimalsCensusByConsumption
  ) {
    this.fetchAnimalsCensusByConsumption = fetchAnimalsCensusByConsumption;
  }

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.fetchAnimalsCensusByConsumption.execute();

      return ok(result.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
