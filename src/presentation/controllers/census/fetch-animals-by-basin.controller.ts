import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchAnimalsCensusByBasin } from "../../../domain/use-cases/census/fetch-animals-by-basin";
import { ok } from "../helpers";

export class FetchAnimalsCensusByBasinController
  implements Controller<void, HttpResponse>
{
  private fetchAnimalsCensusByBasin: FetchAnimalsCensusByBasin;

  constructor(fetchAnimalsCensusByBasin: FetchAnimalsCensusByBasin) {
    this.fetchAnimalsCensusByBasin = fetchAnimalsCensusByBasin;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchAnimalsCensusByBasin.execute();

    return ok(result.value);
  }
}
