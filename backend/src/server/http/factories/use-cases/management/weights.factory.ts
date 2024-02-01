import { DeleteManagementWeightsByBasin } from "../../../../../domain/use-cases/management/delete-weights-by-basin";
import {
  GetManagementWeightsByBasin,
  GetManagementWeightsByBasinUseCaseProtocol,
} from "../../../../../domain/use-cases/management/get-weights-by-basin";
import { InsertManagementWeightsByBasin } from "../../../../../domain/use-cases/management/insert-weights";
import { DbManagementWeightsRepository } from "../../../../../infra/database/postgres/repositories/management-weights.repository";

export class ManagementWeightsUseCasesFactory {
  private static repository = new DbManagementWeightsRepository();

  static makeDeleteManagementWeightsByBasin(): DeleteManagementWeightsByBasin {
    return new DeleteManagementWeightsByBasin(this.repository);
  }

  static makeGetManagementWeightsByBasin(): GetManagementWeightsByBasinUseCaseProtocol.UseCase {
    return new GetManagementWeightsByBasin(this.repository);
  }

  static makeInsertManagementWeights(): InsertManagementWeightsByBasin {
    return new InsertManagementWeightsByBasin(this.repository);
  }
}
