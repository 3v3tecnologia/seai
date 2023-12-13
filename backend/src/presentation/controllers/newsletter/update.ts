import { HttpResponse } from "../ports";

import { UpdateNews } from "../../../domain/use-cases/newsletter";
import { forbidden, ok, serverError } from "../helpers";

export class UpdateController {
  private useCase: UpdateNews;

  constructor(useCase: UpdateNews) {
    this.useCase = useCase;
  }

  async handle(request: UpdateController.Request): Promise<HttpResponse> {
    try {
      const createdOrError = await this.useCase.create({
        Id: request.id,
        Data: request.Data,
        Description: request.Description,
        FK_Author: request.FK_Author,
        Title: request.Title,
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
    SendDate?: string;
  };
}
