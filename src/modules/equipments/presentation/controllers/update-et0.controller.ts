import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { UpdateEt0 } from "../../services/update-et0";
import { RegisterUserLogs } from "../../../system-logs/services/register-user-logs";
import { badRequest, ok, serverError } from "../../../../presentation/controllers/helpers";

export class UpdateEt0Controller
  implements Controller<UpdateEt0ControllerProtocol.Request, HttpResponse> {
  private updateEquipment: UpdateEt0;
  private userLogs: RegisterUserLogs;

  constructor(updateEquipment: UpdateEt0, userLogs: RegisterUserLogs) {
    this.updateEquipment = updateEquipment;
    this.userLogs = userLogs;
  }

  async handle(
    request: UpdateEt0ControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const resultOrError = await this.updateEquipment.execute({
        measurements: request.Measurements,
      });

      if (resultOrError.isLeft()) {
        return badRequest(resultOrError.value);
      }

      // await this.userLogs.log(request.accountId, this.updateEquipment);

      return ok(resultOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace UpdateEt0ControllerProtocol {
  export type Request = {
    accountId: number;
    Measurements: Array<number>;
  };
}
