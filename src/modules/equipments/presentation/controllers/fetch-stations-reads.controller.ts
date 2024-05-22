import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { ok, badRequest, serverError } from "../../../../presentation/controllers/helpers";
import { FetchStationsReads } from "../../services/fetch-stations-reads";
import { Notification } from "../../../../shared/core/notification/notification";
import { IPaginationInput, parsePaginationInput } from "../../../../shared/core/pagination";

export class FetchStationsReadsController
  implements
  Controller<FetchStationsMeasuresControllerProtocol.Request, HttpResponse> {
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
        ...parsePaginationInput({
          page: request.pageNumber,
          limit: request.limit
        }),
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
    start?: string;
    end?: string | null;
  } & IPaginationInput;
}
