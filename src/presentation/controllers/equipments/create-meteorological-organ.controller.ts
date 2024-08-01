import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { MeteorologicalOrganEntity } from "../../../domain/entities/equipments/MetereologicalOrgan";
import { CreateMeteorologicalOrgan } from "../../../domain/use-cases/equipments/create-meteorological-organ";
import { badRequest, ok, serverError } from "../helpers";

export class CreateMeteorologicalOrganController
  implements
    Controller<
      CreateMeteorologicalOrganControllerProtocol.Request,
      HttpResponse
    >
{
  private createMeteorologicalOrgan: CreateMeteorologicalOrgan;

  constructor(createMeteorologicalOrgan: CreateMeteorologicalOrgan) {
    this.createMeteorologicalOrgan = createMeteorologicalOrgan;
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
