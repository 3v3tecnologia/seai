import { DbLogOperationsRepository } from "../../../../infra/database/postgres/repositories/log-operations-repository";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { LogControllerDecorator } from "../../decorator";

export const makeLogControllerDecorator = (
  controller: Controller
): Controller => {
  const logMongoRepository = new DbLogOperationsRepository();
  return new LogControllerDecorator(controller, logMongoRepository);
};
