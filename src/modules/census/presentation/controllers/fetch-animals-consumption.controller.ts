import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { FetchAnimalsCensusByConsumption } from "../../services/fetch-animals-by-consumption";
import { ok } from "../../../../presentation/controllers/helpers";

export class FetchAnimalsConsumptionCensusController
  implements Controller<void, HttpResponse> {
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
