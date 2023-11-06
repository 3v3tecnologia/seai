import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { MeteorologicalOrganEntity } from "../../../domain/entities/equipments/MetereologicalOrgan";
import { UpdateMeteorologicalOrgan } from "../../../domain/use-cases/equipments/update-meteorological-organ";
import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { Notification } from "../../../shared/notification/notification";
import { badRequest, ok, serverError } from "../helpers";

export class UpdateMeteorologicalOrganController
  implements
    Controller<
      UpdateMeteorologicalOrganControllerProtocol.Request,
      HttpResponse
    >
{
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
        IdOrgan: request.id,
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
  } & Required<Omit<MeteorologicalOrganEntity, "IdOrgan">>;
}
