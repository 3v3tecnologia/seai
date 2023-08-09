import { Either, right } from "../../../shared/Either";
import {
  CensusTakersByCountyData,
  CensusTakersRepositoryProtocol,
} from "../_ports/repositories/census-takers-repository";

export class FetchCensusTakersCensusByCounty {
  private readonly censusTakersRepository: CensusTakersRepositoryProtocol;

  constructor(censusTakersRepository: CensusTakersRepositoryProtocol) {
    this.censusTakersRepository = censusTakersRepository;
  }
  async execute(): Promise<
    Either<Error, Array<CensusTakersByCountyData> | null>
  > {
    const data = await this.censusTakersRepository.getByCounty();

    return right(data);
  }
}
