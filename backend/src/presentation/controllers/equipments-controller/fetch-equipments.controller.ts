import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchEquipments } from "../../../domain/use-cases/equipments/fetch-equipments";

import { ok } from "../helpers";

export class FetchEquipmentsController
  implements Controller<void, HttpResponse>
{
  private fetchEquipments: FetchEquipments;

  constructor(fetchEquipments: FetchEquipments) {
    this.fetchEquipments = fetchEquipments;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.fetchEquipments.execute();

    return ok(result.value);
  }
}
