import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { FetchEquipmentsWithYesterdayMeasurementsProtocol } from "../../services";
import { badRequest, ok, serverError } from "../../../../presentation/controllers/helpers";
import { Notification } from "../../../../shared/core/notification/notification";

export class FetchEquipmentsWithYesterdayMeasurementsController
  implements
  Controller<
    FetchEquipmentsWithYesterdayMeasurementsControllerProtocol.Request,
    HttpResponse
  > {
  private useCase: FetchEquipmentsWithYesterdayMeasurementsProtocol.UseCase;

  constructor(
    useCase: FetchEquipmentsWithYesterdayMeasurementsProtocol.UseCase
  ) {
    this.useCase = useCase;
  }

  async handle(
    request: FetchEquipmentsWithYesterdayMeasurementsControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const errors = new Notification();
      if (request.type === undefined || request.type === null) {
        errors.addError(
          new Error(
            "É necessário informar o tipo de equipamento e o valor deve ser 'station' ou 'pluviometer'"
          )
        );
      }

      if (errors.hasErrors()) {
        return badRequest(new Error(errors.messages()));
      }
      const result = await this.useCase.execute(request);

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchEquipmentsWithYesterdayMeasurementsControllerProtocol {
  export type Request = {
    type: "station" | "pluviometer";
  } & {
    latitude?: number;
    longitude?: number;
    distance?: number;
  };
}
