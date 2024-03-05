import {
  ManagementCensusStudy,
  ManagementStudyIndicator,
} from "../../../domain/entities/management/study";
import {
  InsertManagementStudiesByBasin,
  InsertManagementStudiesByBasinUseCaseProtocol,
} from "../../../domain/use-cases/management/insert-studies";
import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { created, forbidden, serverError } from "../helpers";
import { HttpResponse } from "../ports";
import { CommandController } from "../ports/command-controller";

export class InsertManagementStudiesByBasinController extends CommandController<
  InsertManagementStudiesByBasinControllerProtocol.Request,
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
    request: InsertManagementStudiesByBasinControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const dto: InsertManagementStudiesByBasinUseCaseProtocol.Request = {
        Id_Basin: request.id,
        Data: request.Data,
      };

      const successOrError = await this.useCase.execute(dto);

      if (successOrError.isLeft()) {
        return forbidden(successOrError.value);
      }

      await this.userLogs.log(request.accountId, this.useCase);

      return created(successOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace InsertManagementStudiesByBasinControllerProtocol {
  export type Request = {
    accountId: number;
    id: number;
    Data: Array<ManagementCensusStudy>;
  };
}
