import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { FetchAnimalsCensusByBasin } from "../../services/fetch-animals-by-basin";
import { ok } from "../../../../presentation/controllers/helpers";

export class FetchAnimalsCensusByBasinController
  implements Controller<void, HttpResponse> {
  private fetchAnimalsCensusByBasin: FetchAnimalsCensusByBasin;

  constructor(fetchAnimalsCensusByBasin: FetchAnimalsCensusByBasin) {
    this.fetchAnimalsCensusByBasin = fetchAnimalsCensusByBasin;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchAnimalsCensusByBasin.execute();

    return ok(result.value);
  }
}
