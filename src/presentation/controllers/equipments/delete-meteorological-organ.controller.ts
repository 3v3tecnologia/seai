import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { DeleteMeteorologicalOrgan } from "../../../domain/use-cases/equipments/delete-meteorological-organ";
import { badRequest, ok, serverError } from "../helpers";

export class DeleteMeteorologicalOrganController
  implements
    Controller<
      DeleteMeteorologicalOrganControllerProtocol.Request,
      HttpResponse
    >
{
  private deleteMetereologicalOrgan: DeleteMeteorologicalOrgan;

  constructor(deleteMetereologicalOrgan: DeleteMeteorologicalOrgan) {
    this.deleteMetereologicalOrgan = deleteMetereologicalOrgan;
  }

  async handle(
    request: DeleteMeteorologicalOrganControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      if (Reflect.has(request, "id") === false) {
        return badRequest(
          new Error("'id' é obrigatório e deve ser um número inteiro.")
        );
      }
      const resultOrError = await this.deleteMetereologicalOrgan.execute({
        IdOrgan: request.id,
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

export namespace DeleteMeteorologicalOrganControllerProtocol {
  export type Request = {
    accountId: number;
    id: number;
  };
}
