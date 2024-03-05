import { Either, right } from "../../../shared/Either";
import { AquacultureCensusRepositoryProtocol } from "../_ports/repositories/aquaculture-census-repository";

export class FetchCaptationTankCensusByBasin {
  private readonly repository: AquacultureCensusRepositoryProtocol;

  constructor(repository: AquacultureCensusRepositoryProtocol) {
    this.repository = repository;
  }
  async execute(): Promise<Either<Error, Array<any> | null>> {
    const data = await this.repository.getMonthlyVolumePerTanksByBasin();

    return right(data);
  }
}
