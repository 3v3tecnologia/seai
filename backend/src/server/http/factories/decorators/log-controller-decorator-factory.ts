import { LogOperationsRepository } from "../../../../infra/database/postgres/repositories/log-operations-repository";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { LogControllerDecorator } from "../../decorator";

export const makeLogControllerDecorator = (
  controller: Controller
): Controller => {
  const logMongoRepository = new LogOperationsRepository();
  return new LogControllerDecorator(controller, logMongoRepository);
};
