import { CultureWeights } from "../../../domain/entities/management/weights";
import { InsertManagementWeightsByBasin } from "../../../domain/use-cases/management/insert-weights";
import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { created, forbidden, serverError } from "../helpers";
import { HttpResponse } from "../ports";
import { CommandController } from "../ports/command-controller";

export class InsertManagementWeightsByBasinController extends CommandController<
  InsertManagementWeightsByBasinByBasinControllerProtocol.Request,
  HttpResponse
> {
  private useCase: InsertManagementWeightsByBasin;

  constructor(
    useCase: InsertManagementWeightsByBasin,
    userLogs: RegisterUserLogs
  ) {
    super(userLogs);
    this.useCase = useCase;
  }

  async handle(
    request: InsertManagementWeightsByBasinByBasinControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const deletedOrError = await this.useCase.execute({
        Id_Basin: Number(request.id),
        Weights: request.Data,
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

export namespace InsertManagementWeightsByBasinByBasinControllerProtocol {
  export type Request = {
    accountId: number;
    id: number;
    Data: Array<CultureWeights>;
  };
}
