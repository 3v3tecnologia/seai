import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { badRequest, ok, serverError } from "../../../../presentation/controllers/helpers";

import { FetchPluviometersReads } from "../../services/fetch-pluviometers-reads";
import { Notification } from "../../../../shared/core/notification/notification";
import { parsePaginationInput, IPaginationInput } from "../../../../shared/core/pagination";

export class FetchPluviometersReadsController
  implements
  Controller<
    FetchPluviometersMeasuresControllerProtocol.Request,
    HttpResponse
  > {
  private fetchPluviometersReads: FetchPluviometersReads;

  constructor(fetchPluviometersReads: FetchPluviometersReads) {
    this.fetchPluviometersReads = fetchPluviometersReads;
  }

  async handle(
    request: FetchPluviometersMeasuresControllerProtocol.Request
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

      const result = await this.fetchPluviometersReads.execute(dto);

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchPluviometersMeasuresControllerProtocol {
  export type Request = {
    idEquipment: number;
    start?: string;
    end?: string | null;
  } & IPaginationInput;
}
