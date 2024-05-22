import { Either, right } from "../../../shared/Either";
import { AquacultureCensusRepositoryProtocol } from "../_ports/repositories/aquaculture-census-repository";
import { CaptationByCountyData } from "../_ports/repositories/captation-repository";

export class FetchCaptationTankCensusByCounty {
  private readonly repository: AquacultureCensusRepositoryProtocol;

  constructor(repository: AquacultureCensusRepositoryProtocol) {
    this.repository = repository;
  }
  async execute(): Promise<Either<Error, Array<CaptationByCountyData> | null>> {
    const data = await this.repository.getMonthlyVolumePerTanksByCounty();

    return right(data);
  }
}
