import { DeleteManagementWeightsByBasinController } from "../../../../../presentation/controllers/management/delete-weights-by-basin.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeDeleteManagementWeightsByBasinUseCase } from "../../use-cases/management/delete-weights-by-basin.useCase.factory";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeDeleteWeightsByBasinController = (): Controller => {
  return makeLogControllerDecorator(
    new DeleteManagementWeightsByBasinController(
      makeDeleteManagementWeightsByBasinUseCase(),
      makeRegisterUserLogs()
    )
  );
};
