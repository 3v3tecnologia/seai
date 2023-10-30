import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { badRequest, ok } from "../helpers";

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
    const errors = new Notification()

    if(request.idEquipment === undefined || request.idEquipment === null  ){
      errors.addError(new Error("É necessário informar o Id do equipamento, e o valor deve ser numérico"))
    }

    if(errors.hasErrors()){
      return badRequest(new Error(errors.messages()))
    }
    const result = await this.fetchPluviometersReads.execute(request);

    return ok(result.value);
  }
}

export namespace FetchPluviometersMeasuresControllerProtocol {
  export type Request = {
    idEquipment: number;
    pageNumber: number;
  };
}
