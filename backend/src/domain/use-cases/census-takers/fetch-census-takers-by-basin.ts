import { Either, right } from "../../../shared/Either";
import {
  CensusTakersByBasinData,
  CensusTakersRepositoryProtocol,
} from "../_ports/repositories/census-takers-repository";

export class FetchCensusTakersCensusByBasin {
  private readonly censusTakersRepository: CensusTakersRepositoryProtocol;

  constructor(censusTakersRepository: CensusTakersRepositoryProtocol) {
    this.censusTakersRepository = censusTakersRepository;
  }
  async execute(): Promise<
    Either<Error, Array<CensusTakersByBasinData> | null>
  > {
    const data = await this.censusTakersRepository.getByBasin();

    return right(data);
  }
}
