import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchAnimalsCensusByConsumption } from "../../../domain/use-cases/animal-census/fetch-consume/fetch-by-consumption";
import { ok } from "../helpers";

export class FetchAnimalsConsumptionCensusController
  implements Controller<void, HttpResponse>
{
  private fetchAnimalsCensusByConsumption: FetchAnimalsCensusByConsumption;

  constructor(
    fetchAnimalsCensusByConsumption: FetchAnimalsCensusByConsumption
  ) {
    this.fetchAnimalsCensusByConsumption = fetchAnimalsCensusByConsumption;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchAnimalsCensusByConsumption.execute();

    return ok(result.value);
  }
}
