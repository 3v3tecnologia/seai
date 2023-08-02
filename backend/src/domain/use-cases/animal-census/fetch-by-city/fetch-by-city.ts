import { Either, right } from "../../../../shared/Either";
import {
  AnimalsByCityData,
  AnimalsCensusRepositoryProtocol,
} from "../../_ports/repositories/animal-census-repository";

export class FetchAnimalsCensusByCity {
  private readonly animalRepository: AnimalsCensusRepositoryProtocol;

  constructor(animalRepository: AnimalsCensusRepositoryProtocol) {
    this.animalRepository = animalRepository;
  }
  async execute(): Promise<Either<Error, Array<AnimalsByCityData> | null>> {
    const data = await this.animalRepository.getByCity();
    return right(data);
  }
}
