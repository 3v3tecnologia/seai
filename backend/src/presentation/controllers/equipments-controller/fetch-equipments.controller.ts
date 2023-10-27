import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchEquipments } from "../../../domain/use-cases/equipments/fetch-equipments";

import { ok } from "../helpers";

export class FetchEquipmentsController
  implements
    Controller<FetchEquipmentsControllerProtocol.Request, HttpResponse>
{
  private fetchEquipments: FetchEquipments;

  constructor(fetchEquipments: FetchEquipments) {
    this.fetchEquipments = fetchEquipments;
  }

  async handle(
    request: FetchEquipmentsControllerProtocol.Request
  ): Promise<HttpResponse> {
    const result = await this.fetchEquipments.execute(request);

    return ok(result.value);
  }
}

export namespace FetchEquipmentsControllerProtocol {
  export type Request = {
    pageNumber: number;
  };
}
