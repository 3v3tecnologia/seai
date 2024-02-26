import { Either, right } from "../../../shared/Either";
import {
  CaptationByBasinData,
  CaptationCensusRepositoryProtocol,
} from "../_ports/repositories/captation-repository";

export class FetchCaptationCensusByBasin {
  private readonly repository: CaptationCensusRepositoryProtocol;

  constructor(repository: CaptationCensusRepositoryProtocol) {
    this.repository = repository;
  }
  async execute(): Promise<Either<Error, Array<CaptationByBasinData> | null>> {
    const data = await this.repository.getFlowAndVolumeAvgByBasin();

    return right(data);
  }
}
