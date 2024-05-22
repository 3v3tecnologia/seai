import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { FetchAnimalsCensusByCity } from "../../services/fetch-animals-by-city";
import { ok } from "../../../../presentation/controllers/helpers";

export class FetchAnimalsCensusByCityController
  implements Controller<void, HttpResponse> {
  private fetchAnimalsCensusByCity: FetchAnimalsCensusByCity;

  constructor(fetchAnimalsCensusByCity: FetchAnimalsCensusByCity) {
    this.fetchAnimalsCensusByCity = fetchAnimalsCensusByCity;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchAnimalsCensusByCity.execute();

    return ok(result.value);
  }
}
