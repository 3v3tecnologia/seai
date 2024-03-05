import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchStationReadsByIdRead } from "../../../domain/use-cases/equipments/fetch-station-reads-by-id-read";
import { Notification } from "../../../shared/notification/notification";
import { badRequest, ok, serverError } from "../helpers";

export class FetchStationReadsByIdReadController
  implements
    Controller<
      FetchStationReadsByIdReadControllerProtocol.Request,
      HttpResponse
    >
{
  private fetchStationsReads: FetchStationReadsByIdRead;

  constructor(fetchStationsReads: FetchStationReadsByIdRead) {
    this.fetchStationsReads = fetchStationsReads;
  }

  async handle(
    request: FetchStationReadsByIdReadControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const errors = new Notification();

      if (request.id === undefined || request.id === null) {
        errors.addError(
          new Error(
            "É necessário informar o Id da leitura do equipamento, e o valor deve ser numérico"
          )
        );
      }

      if (errors.hasErrors()) {
        return badRequest(new Error(errors.messages()));
      }

      const dto = {
        idRead: request.id,
      };

      const result = await this.fetchStationsReads.execute(dto);

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchStationReadsByIdReadControllerProtocol {
  export type Request = {
    id: number;
  };
}
