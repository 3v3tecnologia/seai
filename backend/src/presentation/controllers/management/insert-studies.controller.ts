import { InsertManagementStudiesByBasin } from "../../../domain/use-cases/management/insert-studies.useCase";
import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { created, forbidden, serverError } from "../helpers";
import { HttpResponse } from "../ports";
import { CommandController } from "../ports/command-controller";

export class InsertManagementStudiesByBasinController extends CommandController<
  InsertManagementStudiesByBasinUseCaseProtocol.Request,
  HttpResponse
> {
  private useCase: InsertManagementStudiesByBasin;

  constructor(
    useCase: InsertManagementStudiesByBasin,
    userLogs: RegisterUserLogs
  ) {
    super(userLogs);
    this.useCase = useCase;
  }

  async handle(
    request: InsertManagementStudiesByBasinUseCaseProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const deletedOrError = await this.useCase.execute({
        Id: request.id,
        Data: request.Data,
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

export namespace InsertManagementStudiesByBasinUseCaseProtocol {
  export type Request = {
    accountId: number;
    id: number;
    Data: any;
  };
}
