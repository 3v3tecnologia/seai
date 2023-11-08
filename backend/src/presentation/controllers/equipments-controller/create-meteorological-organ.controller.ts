import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { MeteorologicalOrganEntity } from "../../../domain/entities/equipments/MetereologicalOrgan";
import { CreateMeteorologicalOrgan } from "../../../domain/use-cases/equipments/create-meteorological-organ";
import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { badRequest, ok, serverError } from "../helpers";

export class CreateMeteorologicalOrganController
  implements
    Controller<
      CreateMeteorologicalOrganControllerProtocol.Request,
      HttpResponse
    >
{
  private createMeteorologicalOrgan: CreateMeteorologicalOrgan;
  private userLogs: RegisterUserLogs;

  constructor(
    createMeteorologicalOrgan: CreateMeteorologicalOrgan,
    userLogs: RegisterUserLogs
  ) {
    this.createMeteorologicalOrgan = createMeteorologicalOrgan;
    this.userLogs = userLogs;
  }

  async handle(
    request: CreateMeteorologicalOrganControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      if (Reflect.has(request, "Host") && typeof request.Host !== "string") {
        return badRequest(new Error("'Host' deve ser do tipo string."));
      }
      const resultOrError = await this.createMeteorologicalOrgan.execute({
        Host: request.Host,
        Name: request.Name,
        Password: request.Password,
        User: request.User,
      });

      if (resultOrError.isLeft()) {
        return badRequest(resultOrError.value);
      }

      await this.userLogs.log(
        request.accountId,
        this.createMeteorologicalOrgan
      );

      return ok(resultOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace CreateMeteorologicalOrganControllerProtocol {
  export type Request = {
    accountId: number;
  } & Required<Omit<MeteorologicalOrganEntity, "Id">>;
}
