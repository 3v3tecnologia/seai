import {
  DeleteManagementStudiesByBasin,
  DeleteManagementWeightsByBasin,
  GetManagementStudiesByBasin,
  GetManagementStudiesByBasinUseCaseProtocol,
  GetManagementWeightsByBasin,
  GetManagementWeightsByBasinUseCaseProtocol,
  InsertManagementStudiesByBasin,
  InsertManagementWeightsByBasin,
} from "../../../../domain/use-cases/management";
import {
  GetCulturesIndicatorsFromBasin,
  GetCulturesIndicatorsFromBasinUseCaseProtocol,
} from "../../../../domain/use-cases/management/get-cultures-indicators-from-basin";
import { DbManagementStudiesRepository } from "../../../../infra/database/postgres/repositories/management-studies.repository";
import { DbManagementWeightsRepository } from "../../../../infra/database/postgres/repositories/management-weights.repository";
import { DbProducerRepository } from "../../../../infra/database/postgres/repositories/producer.repository";

export class ManagementUseCasesFactory {
  private static repository = new DbManagementStudiesRepository();

  static makeDeleteManagementStudiesByBasin(): DeleteManagementStudiesByBasin {
    return new DeleteManagementStudiesByBasin(this.repository);
  }

  static makeGetManagementStudiesByBasin(): GetManagementStudiesByBasinUseCaseProtocol.UseCase {
    return new GetManagementStudiesByBasin(this.repository);
  }

  static makeInsertManagementStudies(): InsertManagementStudiesByBasin {
    return new InsertManagementStudiesByBasin(this.repository);
  }
}

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

// Remove from management
export class CulturesUseCasesFactory {
  private static repository = new DbProducerRepository();

  static makeGetCultureIndicatorsFromBasin(): GetCulturesIndicatorsFromBasinUseCaseProtocol.UseCase {
    return new GetCulturesIndicatorsFromBasin(
      this.repository
      // new DbManagementStudiesRepository()
    );
  }
}
