import { HttpResponse } from "../../../presentation/controllers/ports";
import { Controller } from "../../../presentation/controllers/ports/controllers";

export interface LogErrorRepository {
  logError: (stack: string) => Promise<void>;
}

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

    if (response.statusCode === 500) {
      await this.logErrorRepository.logError(response.body.stack);
    }

    return response;
  }
}
