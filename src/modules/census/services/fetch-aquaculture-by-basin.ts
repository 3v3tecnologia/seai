import { Either, right } from "../../../shared/Either";
import {
  AquacultureByBasinData,
  AquacultureCensusRepositoryProtocol,
} from "../infra/repositories/protocols/aquaculture-census-repository";

export class FetchAquacultureCensusByBasin {
  private readonly repository: AquacultureCensusRepositoryProtocol;

  constructor(repository: AquacultureCensusRepositoryProtocol) {
    this.repository = repository;
  }
  async execute(): Promise<
    Either<Error, Array<AquacultureByBasinData> | null>
  > {
    const data = await this.repository.getByBasin();

    return right(data);
  }
}
