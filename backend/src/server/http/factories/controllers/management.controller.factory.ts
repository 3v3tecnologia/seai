import {
  DeleteManagementStudiesByBasinController,
  DeleteManagementWeightsByBasinController,
  GetManagementStudiesByBasinController,
  GetManagementWeightsByBasinController,
  InsertManagementStudiesByBasinController,
  InsertManagementWeightsByBasinController,
} from "../../../../presentation/controllers/management";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../decorators";
import {
  ManagementUseCasesFactory,
  ManagementWeightsUseCasesFactory,
  SystemLogsUseCaseFactory,
} from "../use-cases";

export class ManagementControllersFactory {
  static makeDeleteStudiesByBasin(): Controller {
    return makeLogControllerDecorator(
      new DeleteManagementStudiesByBasinController(
        ManagementUseCasesFactory.makeDeleteManagementStudiesByBasin(),
        SystemLogsUseCaseFactory.makeRegisterUserLogs()
      )
    );
  }

  static makeGetStudiesByBasin(): Controller {
    return new GetManagementStudiesByBasinController(
      ManagementUseCasesFactory.makeGetManagementStudiesByBasin()
    );
  }

  static makeInsertManagementStudies(): Controller {
    return makeLogControllerDecorator(
      new InsertManagementStudiesByBasinController(
        ManagementUseCasesFactory.makeInsertManagementStudies(),
        SystemLogsUseCaseFactory.makeRegisterUserLogs()
      )
    );
  }

  static makeDeleteWeightsByBasin(): Controller {
    return makeLogControllerDecorator(
      new DeleteManagementWeightsByBasinController(
        ManagementWeightsUseCasesFactory.makeDeleteManagementWeightsByBasin(),
        SystemLogsUseCaseFactory.makeRegisterUserLogs()
      )
    );
  }

  static makeGetWeightsByBasin(): Controller {
    return new GetManagementWeightsByBasinController(
      ManagementWeightsUseCasesFactory.makeGetManagementWeightsByBasin()
    );
  }

  static makeInsertManagementWeights(): Controller {
    return makeLogControllerDecorator(
      new InsertManagementWeightsByBasinController(
        ManagementWeightsUseCasesFactory.makeInsertManagementWeights(),
        SystemLogsUseCaseFactory.makeRegisterUserLogs()
      )
    );
  }
}
