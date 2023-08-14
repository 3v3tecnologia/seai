import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchAnimalsCensusByCity } from "../../../domain/use-cases/animal-census/fetch-by-city/fetch-by-city";
import { ok } from "../helpers";

export class FetchAnimalsCensusByCityController
  implements Controller<void, HttpResponse>
{
  private fetchAnimalsCensusByCity: FetchAnimalsCensusByCity;

  constructor(fetchAnimalsCensusByCity: FetchAnimalsCensusByCity) {
    this.fetchAnimalsCensusByCity = fetchAnimalsCensusByCity;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchAnimalsCensusByCity.execute();

    return ok(result.value);
  }
}
