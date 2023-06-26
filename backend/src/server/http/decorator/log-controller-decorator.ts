import { LogErrorRepository } from "../../../infra/database/postgres/repositories/log-operations-repository";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { Controller } from "../../../presentation/controllers/ports/controllers";

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller;
  private readonly logErrorRepository: LogErrorRepository;

  constructor(controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controller = controller;
    this.logErrorRepository = logErrorRepository;
  }
  async handle(request: any): Promise<HttpResponse> {
    console.log("[LOG] CONTROLLER ::: ", request);
    const response = await this.controller.handle(request);

    if (response.statusCode > 299) {
      await this.logErrorRepository.logError(response.body.message);
    } else {
      await this.logErrorRepository.logInfo(response.body.value);
    }

    return response;
  }
}
