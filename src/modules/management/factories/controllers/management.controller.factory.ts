import { GetManagementWeightsByBasinController } from "../../../../modules/management/presentation/controllers/get-weights-by-basin";
import { Controller } from "../../../../shared/presentation/controllers";
import { ManagementWeightsUseCasesFactory } from "../use-cases/management.useCase.factory";

export class ManagementControllersFactory {
  //   static makeDeleteWeightsByBasin(): Controller {
  //     return makeLogControllerDecorator(
  //       new DeleteManagementWeightsByBasinController(
  //         ManagementWeightsUseCasesFactory.makeDeleteManagementWeightsByBasin(),
  //         SystemLogsUseCaseFactory.makeRegisterUserLogs()
  //       )
  //     );
  //   }

  static makeGetWeightsByBasin(): Controller {
    return new GetManagementWeightsByBasinController(
      ManagementWeightsUseCasesFactory.makeGetManagementWeightsByBasin()
    );
  }

  //   static makeInsertManagementWeights(): Controller {
  //     return makeLogControllerDecorator(
  //       new InsertManagementWeightsByBasinController(
  //         ManagementWeightsUseCasesFactory.makeInsertManagementWeights(),
  //         SystemLogsUseCaseFactory.makeRegisterUserLogs()
  //       )
  //     );
  //   }
}

// export const managementControllerFactory = new ManagementCropController(
//   managementCropUseCasesFactory
// );
