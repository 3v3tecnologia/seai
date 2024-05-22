import { Either, right } from "../../../shared/Either";
import {
  AquacultureByCountyData,
  AquacultureCensusRepositoryProtocol,
} from "../infra/repositories/protocols/aquaculture-census-repository";

export class FetchAquacultureCensusByCounty {
  private readonly repository: AquacultureCensusRepositoryProtocol;

  constructor(repository: AquacultureCensusRepositoryProtocol) {
    this.repository = repository;
  }
  async execute(): Promise<
    Either<Error, Array<AquacultureByCountyData> | null>
  > {
    const data = await this.repository.getByCounty();

    return right(data);
  }
}
