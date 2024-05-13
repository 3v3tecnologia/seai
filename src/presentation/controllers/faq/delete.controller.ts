import { HttpResponse } from "../ports";

import { DeleteFaq } from "../../../domain/use-cases/faq/delete-faq";
import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { badRequest, forbidden, ok, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

export class DeleteFaqController extends CommandController<
  DeleteFaqController.Request,
  HttpResponse
> {
  private DeleteFaq: DeleteFaq;

  constructor(DeleteFaq: DeleteFaq, userLogs: RegisterUserLogs) {
    super(userLogs);
    this.DeleteFaq = DeleteFaq;
  }

  async handle(request: DeleteFaqController.Request): Promise<HttpResponse> {
    try {
      if (request.id === null || request.id === undefined) {
        return badRequest(new Error("É necessário informar o id do faq."));
      }
      const result = await this.DeleteFaq.execute(request);

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      await this.userLogs.log(request.accountId, this.DeleteFaq);

      return ok(`Faq deletado com sucesso`);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace DeleteFaqController {
  export type Request = {
    accountId: number;
    id: number;
  };
}
