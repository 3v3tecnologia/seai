import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchEquipments } from "../../../domain/use-cases/equipments/fetch-equipments";

import { ok, serverError } from "../helpers";
import {
  IPaginationInput,
  parsePaginationInput,
} from "../../../domain/use-cases/helpers/pagination";

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
      console.log(request);
      const dto = {
        ...parsePaginationInput({
          page: request.pageNumber,
          limit: request.limit,
        }),
      };

      if (request.idOrgan) {
        Object.assign(dto, {
          idOrgan: request.idOrgan,
        });
      }

      if (request.name) {
        Object.assign(dto, {
          name: request.name,
        });
      }

      if (request.idType) {
        Object.assign(dto, {
          idType: request.idType,
        });
      }

      if (request.enabled) {
        Object.assign(dto, {
          enabled: request.enabled,
        });
      }

      if (request.only_with_measurements && request.idType) {
        Object.assign(dto, {
          only_with_measurements: request.only_with_measurements === "true",
        });
      }
      const result = await this.fetchEquipments.execute(dto);

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchEquipmentsControllerProtocol {
  export type Request = {
    equipmentId?: number;
    idOrgan?: number;
    idType?: number;
    name?: string;
    enabled?: boolean;
    only_with_measurements?: string;
  } & IPaginationInput;
}
