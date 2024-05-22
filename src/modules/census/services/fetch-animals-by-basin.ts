import { Either, right } from "../../../shared/Either";
import {
  AnimalsByBasinData,
  AnimalsCensusRepositoryProtocol,
} from "../infra/repositories/protocols/animal-census-repository";

export class FetchAnimalsCensusByBasin {
  private readonly animalRepository: AnimalsCensusRepositoryProtocol;

  constructor(animalRepository: AnimalsCensusRepositoryProtocol) {
    this.animalRepository = animalRepository;
  }
  async execute(): Promise<Either<Error, AnimalsByBasinData | null>> {
    const data = await this.animalRepository.getByBasin();
    return right(data);
  }
}
