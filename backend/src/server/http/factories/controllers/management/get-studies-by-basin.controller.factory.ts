import { GetManagementStudiesByBasinController } from "../../../../../presentation/controllers/management/get-studies-by-basin.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeGetManagementStudiesByBasinUseCase } from "../../use-cases/management/get-studies-by-basin.useCase.factory";

export const makeGetStudiesByBasinController = (): Controller => {
  return new GetManagementStudiesByBasinController(
    makeGetManagementStudiesByBasinUseCase()
  );
};
