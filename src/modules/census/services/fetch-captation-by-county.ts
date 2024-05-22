import { Either, right } from "../../../shared/Either";
import {
  CaptationByCountyData,
  CaptationCensusRepositoryProtocol,
} from "../infra/repositories/protocols/captation-repository";

export class FetchCaptationCensusByCounty {
  private readonly repository: CaptationCensusRepositoryProtocol;

  constructor(repository: CaptationCensusRepositoryProtocol) {
    this.repository = repository;
  }
  async execute(): Promise<Either<Error, Array<CaptationByCountyData> | null>> {
    const data = await this.repository.getFlowAndVolumeAvgByCounty();

    return right(data);
  }
}
