import { HttpResponse } from "../ports";

import { DeleteManagementWeightsByBasin } from "../../../domain/use-cases/management/delete-weights-by-basin";
import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { created, forbidden, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

export class DeleteManagementWeightsByBasinController extends CommandController<
  DeleteManagementWeightsByBasinControllerProtocol.Request,
  HttpResponse
> {
  private useCase: DeleteManagementWeightsByBasin;

  constructor(
    useCase: DeleteManagementWeightsByBasin,
    userLogs: RegisterUserLogs
  ) {
    super(userLogs);
    this.useCase = useCase;
  }

  async handle(
    request: DeleteManagementWeightsByBasinControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const deletedOrError = await this.useCase.execute({
        Id: request.id,
      });

      if (deletedOrError.isLeft()) {
        return forbidden(deletedOrError.value);
      }

      await this.userLogs.log(request.accountId, this.useCase);

      return created(deletedOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace DeleteManagementWeightsByBasinControllerProtocol {
  export type Request = {
    accountId: number;
    id: number;
  };
}
