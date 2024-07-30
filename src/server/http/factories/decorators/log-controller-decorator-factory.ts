import { DbLogOperationsRepository } from "../../../../modules/User/Government/infra/database/repository/user-operations.repository";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { LogControllerDecorator } from "../../decorator";

export const makeLogControllerDecorator = (
  controller: Controller
): Controller => {
  const logMongoRepository = new DbLogOperationsRepository();
  return new LogControllerDecorator(controller, logMongoRepository);
};
