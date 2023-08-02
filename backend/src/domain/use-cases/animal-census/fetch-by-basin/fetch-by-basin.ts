import { Either, right } from "../../../../shared/Either";
import {
  AnimalsByBasinData,
  AnimalsCensusRepositoryProtocol,
} from "../../_ports/repositories/animal-census-repository";

export class FetchAnimalsCensusByBasin {
  private readonly animalRepository: AnimalsCensusRepositoryProtocol;

  constructor(animalRepository: AnimalsCensusRepositoryProtocol) {
    this.animalRepository = animalRepository;
  }
  async execute(): Promise<Either<Error, Array<AnimalsByBasinData> | null>> {
    const data = await this.animalRepository.getByBasin();
    return right(data);
  }
}
