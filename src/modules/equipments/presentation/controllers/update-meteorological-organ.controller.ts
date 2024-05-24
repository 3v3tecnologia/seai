import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { MeteorologicalOrganEntity } from "../../core/models/MetereologicalOrgan";
import { UpdateMeteorologicalOrgan } from "../../services/update-meteorological-organ";
import { RegisterUserLogs } from "../../../system-logs/services/register-user-logs";
import { Notification } from "../../../../shared/core/notification/notification";
import { badRequest, ok, serverError } from "../../../../presentation/controllers/helpers";

export class UpdateMeteorologicalOrganController
  implements
  Controller<
    UpdateMeteorologicalOrganControllerProtocol.Request,
    HttpResponse
  > {
  private updateMeteorologicalOrgan: UpdateMeteorologicalOrgan;
  private userLogs: RegisterUserLogs;

  constructor(
    updateMeteorologicalOrgan: UpdateMeteorologicalOrgan,
    userLogs: RegisterUserLogs
  ) {
    this.updateMeteorologicalOrgan = updateMeteorologicalOrgan;
    this.userLogs = userLogs;
  }

  async handle(
    request: UpdateMeteorologicalOrganControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const errors = new Notification();

      if (Reflect.has(request, "id") && typeof request.Host !== "string") {
        errors.addError(
          new Error('"id" do órgão é obrigatório e deve ser um número.')
        );
      }

      if (Reflect.has(request, "Host") && typeof request.Host !== "string") {
        return badRequest(new Error("'Host' deve ser do tipo string."));
      }

      if (errors.hasErrors()) {
        return badRequest(new Error(errors.messages()));
      }

      const resultOrError = await this.updateMeteorologicalOrgan.execute({
        Id: request.id,
        Host: request.Host,
        Name: request.Name,
        Password: request.Password || null,
        User: request.User || null,
      });

      if (resultOrError.isLeft()) {
        return badRequest(resultOrError.value);
      }

      await this.userLogs.log(
        request.accountId,
        this.updateMeteorologicalOrgan
      );

      return ok(resultOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace UpdateMeteorologicalOrganControllerProtocol {
  export type Request = {
    accountId: number;
    id: number;
  } & Required<Omit<MeteorologicalOrganEntity, "Id">>;
}
