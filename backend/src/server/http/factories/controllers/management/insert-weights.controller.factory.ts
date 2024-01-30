import { InsertManagementWeightsByBasinController } from "../../../../../presentation/controllers/management/insert-weights.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeInsertManagementWeightsUseCase } from "../../use-cases/management/insert-weights.useCase.factory";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeInsertManagementWeightsController = (): Controller => {
  return makeLogControllerDecorator(
    new InsertManagementWeightsByBasinController(
      makeInsertManagementWeightsUseCase(),
      makeRegisterUserLogs()
    )
  );
};
