import { InsertManagementStudiesByBasinController } from "../../../../../presentation/controllers/management/insert-studies.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeInsertManagementStudiesUseCase } from "../../use-cases/management/insert-studies.useCase.factory";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeInsertManagementStudiesController = (): Controller => {
  return makeLogControllerDecorator(
    new InsertManagementStudiesByBasinController(
      makeInsertManagementStudiesUseCase(),
      makeRegisterUserLogs()
    )
  );
};
