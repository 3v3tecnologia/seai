import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchAnimalsCensusByCity } from "../../../domain/use-cases/census/fetch-animals-by-city";
import { ok, serverError } from "../helpers";

export class FetchAnimalsCensusByCityController
  implements Controller<void, HttpResponse> {
  private fetchAnimalsCensusByCity: FetchAnimalsCensusByCity;

  constructor(fetchAnimalsCensusByCity: FetchAnimalsCensusByCity) {
    this.fetchAnimalsCensusByCity = fetchAnimalsCensusByCity;
  }

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.fetchAnimalsCensusByCity.execute();

      return ok(result.value);
    } catch (error) {
      return serverError(error as Error);

    }
  }
}
