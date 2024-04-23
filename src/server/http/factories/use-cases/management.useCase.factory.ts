import {
  GetManagementWeightsByBasin,
  GetManagementWeightsByBasinUseCaseProtocol,
} from "../../../../domain/use-cases/management/get-weights-by-basin";
import { DbManagementWeightsRepository } from "../../../../infra/database/postgres/repositories/management-weights.repository";
import { SecurityIndicatorsUseCaseFactory } from "./indicators.useCase.factory";
// export class ManagementUseCasesFactory {
//   private static repository = new DbManagementStudiesRepository();

//   static makeDeleteManagementStudiesByBasin(): DeleteManagementStudiesByBasin {
//     return new DeleteManagementStudiesByBasin(this.repository);
//   }

//   static makeGetManagementStudiesByBasin(): GetManagementStudiesByBasinUseCaseProtocol.UseCase {
//     return new GetManagementStudiesByBasin(this.repository);
//   }

//   static makeInsertManagementStudies(): InsertManagementStudiesByBasin {
//     return new InsertManagementStudiesByBasin(this.repository);
//   }
// }

export class ManagementWeightsUseCasesFactory {
  private static repository = new DbManagementWeightsRepository();

  //   static makeDeleteManagementWeightsByBasin(): DeleteManagementWeightsByBasin {
  //     return new DeleteManagementWeightsByBasin(this.repository);
  //   }

  static makeGetManagementWeightsByBasin(): GetManagementWeightsByBasinUseCaseProtocol.UseCase {
    return new GetManagementWeightsByBasin(
      this.repository,
      SecurityIndicatorsUseCaseFactory.makeGetCropsIndicatorsFromBasin()
    );
  }

  //   static makeInsertManagementWeights(): InsertManagementWeightsByBasin {
  //     return new InsertManagementWeightsByBasin(this.repository);
  //   }
}

// export const managementCropUseCasesFactory = new CropUseCases(
//   new DbManagementCropRepository()
// );
