import { DbLogOperationsRepository } from "../../../../shared/db/database/postgres/repositories/log-operations-repository";
import { Controller } from "../../../shared/presentation/controllers";
import { LogControllerDecorator } from ".";

export const makeLogControllerDecorator = (
  controller: Controller
): Controller => {
  const logMongoRepository = new DbLogOperationsRepository();
  return new LogControllerDecorator(controller, logMongoRepository);
};
