import { HttpResponse } from "../ports";

import { DeleteFaq } from "../../../domain/use-cases/faq/delete-faq/delete-faq";
import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { forbidden, ok, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

// Controllers são classes puras e não devem depender de frameworks
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
      const result = await this.DeleteFaq.delete(request);

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      await this.userLogs.log(request.accountId, this.DeleteFaq.useCaseLogs());
      //Add validation here
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
