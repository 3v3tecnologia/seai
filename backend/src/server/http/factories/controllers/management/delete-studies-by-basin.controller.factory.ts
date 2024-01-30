import { DeleteManagementStudiesByBasinController } from "../../../../../presentation/controllers/management/delete-management-studies-by-basin.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeDeleteManagementStudiesByBasinUseCase } from "../../use-cases/management/delete-studies-by-basin.useCase.factory";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeDeleteStudiesByBasinController = (): Controller => {
  return makeLogControllerDecorator(
    new DeleteManagementStudiesByBasinController(
      makeDeleteManagementStudiesByBasinUseCase(),
      makeRegisterUserLogs()
    )
  );
};
