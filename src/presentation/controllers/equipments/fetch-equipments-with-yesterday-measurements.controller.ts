import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchEquipmentsWithYesterdayMeasurementsProtocol } from "../../../domain/use-cases/equipments";
import { badRequest, ok, serverError } from "../helpers";
import { Notification } from "../../../shared/notification/notification";

export class FetchEquipmentsWithYesterdayMeasurementsController
  implements
    Controller<
      FetchEquipmentsWithYesterdayMeasurementsControllerProtocol.Request,
      HttpResponse
    >
{
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
