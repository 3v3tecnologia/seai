import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchEquipments } from "../../../domain/use-cases/equipments/fetch-equipments";

import { ok, serverError } from "../helpers";

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
    try {
      console.log(request)
      const result = await this.fetchEquipments.execute(request);

    return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchEquipmentsControllerProtocol {
  export type Request = {
    pageNumber: number;
    limit:number;
    idOrgan?: number;
    idType?: number;
    name?: string;
  };
}
