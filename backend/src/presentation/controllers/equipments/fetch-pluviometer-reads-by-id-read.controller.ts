import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchPluviometerReadsByIdRead } from "../../../domain/use-cases/equipments/fetch-pluviometer-reads-by-id-read";
import { Notification } from "../../../shared/notification/notification";
import { badRequest, ok, serverError } from "../helpers";

export class FetchPluviometerReadsByIdReadController
  implements
    Controller<
      FetchPluviometerReadsByIdReadControllerProtocol.Request,
      HttpResponse
    >
{
  private fetchStationsReads: FetchPluviometerReadsByIdRead;

  constructor(fetchStationsReads: FetchPluviometerReadsByIdRead) {
    this.fetchStationsReads = fetchStationsReads;
  }

  async handle(
    request: FetchPluviometerReadsByIdReadControllerProtocol.Request
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

export namespace FetchPluviometerReadsByIdReadControllerProtocol {
  export type Request = {
    id: number;
  };
}
