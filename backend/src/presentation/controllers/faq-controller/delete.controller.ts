import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { DeleteFaqProtocol } from "../../../domain/use-cases/faq/delete-faq/ports/delete-faq";
import { forbidden, ok, serverError } from "../helpers";
import { RegisterUserLogs } from "../../../domain/use-cases/logs/register-user-logs";
import { DeleteFaq } from "../../../domain/use-cases/faq/delete-faq/delete-faq";

// Controllers são classes puras e não devem depender de frameworks
export class DeleteFaqController implements Controller {
  private DeleteFaq: DeleteFaq;
  private userLogs: RegisterUserLogs;

  constructor(DeleteFaq: DeleteFaq, userLogs: RegisterUserLogs) {
    this.DeleteFaq = DeleteFaq;
    this.userLogs = userLogs;
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
