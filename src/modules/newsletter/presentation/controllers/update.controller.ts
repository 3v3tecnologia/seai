import { HttpResponse } from "../../../../shared/presentation/ports";

import { UpdateNewsUseCaseProtocol } from "../../services";
import { forbidden, ok, serverError } from "../../../../presentation/controllers/helpers";

export class UpdateController {
  private useCase: UpdateNewsUseCaseProtocol.UseCase;

  constructor(useCase: UpdateNewsUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(request: UpdateController.Request): Promise<HttpResponse> {
    try {
      const createdOrError = await this.useCase.execute({
        Id: request.id,
        Data: request.Data,
        Description: request.Description,
        FK_Author: request.FK_Author,
        Title: request.Title,
        SendDate: request.SendDate,
      });

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      return ok(createdOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace UpdateController {
  export type Request = {
    accountId: number;
    id: number;
    Title: string;
    FK_Author: string;
    Description: string | null;
    Data: any;
    LocationName?: string;
    SendDate: string;
  };
}
