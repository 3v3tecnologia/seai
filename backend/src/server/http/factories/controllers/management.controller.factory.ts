import { DeleteManagementStudiesByBasinController } from "../../../../presentation/controllers/management/delete-management-studies-by-basin.controller";
import { DeleteManagementWeightsByBasinController } from "../../../../presentation/controllers/management/delete-weights-by-basin.controller";
import { GetManagementStudiesByBasinController } from "../../../../presentation/controllers/management/get-studies-by-basin.controller";
import { GetManagementWeightsByBasinController } from "../../../../presentation/controllers/management/get-weights-by-basin.controller";
import { InsertManagementStudiesByBasinController } from "../../../../presentation/controllers/management/insert-studies.controller";
import { InsertManagementWeightsByBasinController } from "../../../../presentation/controllers/management/insert-weights.controller";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../decorators";
import { SystemLogsUseCaseFactory } from "../use-cases";
import {
  ManagementUseCasesFactory,
  ManagementWeightsUseCasesFactory,
} from "../use-cases/management";

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
