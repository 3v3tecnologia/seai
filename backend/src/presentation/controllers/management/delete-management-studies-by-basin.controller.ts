import { HttpResponse } from "../ports";

import { DeleteManagementStudiesByBasin } from "../../../domain/use-cases/management/delete-management-studies-by-basin.useCase";
import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { created, forbidden, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

export class DeleteManagementStudiesByBasinController extends CommandController<
  DeleteManagementStudiesByBasinControllerProtocol.Request,
  HttpResponse
> {
  private useCase: DeleteManagementStudiesByBasin;

  constructor(
    useCase: DeleteManagementStudiesByBasin,
    userLogs: RegisterUserLogs
  ) {
    super(userLogs);
    this.useCase = useCase;
  }

  async handle(
    request: DeleteManagementStudiesByBasinControllerProtocol.Request
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

export namespace DeleteManagementStudiesByBasinControllerProtocol {
  export type Request = {
    accountId: number;
    id: number;
  };
}
