import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { DeleteMeteorologicalOrgan } from "../../services/delete-meteorological-organ";
import { RegisterUserLogs } from "../../../logs/services/register-user-logs";
import { badRequest, ok, serverError } from "../../../../presentation/controllers/helpers";

export class DeleteMeteorologicalOrganController
  implements
  Controller<
    DeleteMeteorologicalOrganControllerProtocol.Request,
    HttpResponse
  > {
  private deleteMetereologicalOrgan: DeleteMeteorologicalOrgan;
  private userLogs: RegisterUserLogs;

  constructor(
    deleteMetereologicalOrgan: DeleteMeteorologicalOrgan,
    userLogs: RegisterUserLogs
  ) {
    this.deleteMetereologicalOrgan = deleteMetereologicalOrgan;
    this.userLogs = userLogs;
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

      await this.userLogs.log(
        request.accountId,
        this.deleteMetereologicalOrgan
      );

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
