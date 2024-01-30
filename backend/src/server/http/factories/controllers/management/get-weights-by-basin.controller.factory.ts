import { GetManagementStudiesByBasinController } from "../../../../../presentation/controllers/management/get-studies-by-basin.controller";
import { GetManagementWeightsByBasinController } from "../../../../../presentation/controllers/management/get-weights-by-basin.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeGetManagementWeightsByBasinUseCase } from "../../use-cases/management/get-weights-by-basin.useCase.factory";

export const makeGetWeightsByBasinController = (): Controller => {
  return new GetManagementWeightsByBasinController(
    makeGetManagementWeightsByBasinUseCase()
  );
};
