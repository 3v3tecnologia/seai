import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok, badRequest, serverError } from "../helpers";
import { FetchStationsReads } from "../../../domain/use-cases/equipments/fetch-stations-reads";
import { Notification } from "../../../shared/notification/notification";

export class FetchStationsReadsController
  implements
    Controller<FetchStationsMeasuresControllerProtocol.Request, HttpResponse>
{
  private fetchStationsReads: FetchStationsReads;

  constructor(fetchStationsReads: FetchStationsReads) {
    this.fetchStationsReads = fetchStationsReads;
  }

  async handle(
    request: FetchStationsMeasuresControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const errors = new Notification();

      if (request.idEquipment === undefined || request.idEquipment === null) {
        errors.addError(
          new Error(
            "É necessário informar o Id do equipamento, e o valor deve ser numérico"
          )
        );
      }

      if (errors.hasErrors()) {
        return badRequest(new Error(errors.messages()));
      }

      const dto = {
        idEquipment: request.idEquipment,
        pageNumber: request.pageNumber || 1,
        limit: request.limit,
      };

      if (request.start) {
        Object.assign(dto, {
          time: {
            start: request.start,
            end: request.end || null,
          },
        });
      }

      const result = await this.fetchStationsReads.execute(dto);

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchStationsMeasuresControllerProtocol {
  export type Request = {
    idEquipment: number;
    pageNumber: number;
    limit: number;
    start?: string;
    end?: string | null;
  };
}
