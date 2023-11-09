import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { badRequest, ok, serverError } from "../helpers";

import { FetchPluviometersReads } from "../../../domain/use-cases/equipments/fetch-pluviometers-reads";
import { Notification } from "../../../shared/notification/notification";

export class FetchPluviometersReadsController
  implements
    Controller<
      FetchPluviometersMeasuresControllerProtocol.Request,
      HttpResponse
    >
{
  private fetchPluviometersReads: FetchPluviometersReads;

  constructor(fetchPluviometersReads: FetchPluviometersReads) {
    this.fetchPluviometersReads = fetchPluviometersReads;
  }

  async handle(
    request: FetchPluviometersMeasuresControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const errors = new Notification();

      console.log(request);

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
      const result = await this.fetchPluviometersReads.execute(request);

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
    pageNumber: number;
    limit: number;
    time?: {
      start: string;
      end: string | null;
    } | null;
  };
}
