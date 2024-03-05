import { DbLogOperationsRepository } from "../../../infra/database/postgres/repositories/log-operations-repository";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { Controller } from "../../../presentation/controllers/ports/controllers";

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller;
  private readonly logErrorRepository: DbLogOperationsRepository;

  constructor(
    controller: Controller,
    logErrorRepository: DbLogOperationsRepository
  ) {
    this.controller = controller;
    this.logErrorRepository = logErrorRepository;
  }
  async handle(request: any): Promise<HttpResponse> {
    const response = await this.controller.handle(request);

    // const user_logs = this.controller.getUseCaseLogs?.();
    // if (user_logs?.length) {
    //   await this.logErrorRepository.logInfo(request.accountId, user_logs);
    // }

    return response;
  }
}
