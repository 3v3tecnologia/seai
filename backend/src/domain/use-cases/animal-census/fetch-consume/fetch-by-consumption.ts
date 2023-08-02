import { Either, right } from "../../../../shared/Either";
import {
  AnimalsConsumptionData,
  AnimalsCensusRepositoryProtocol,
} from "../../_ports/repositories/animal-census-repository";

export class FetchAnimalsCensusByConsumption {
  private readonly animalRepository: AnimalsCensusRepositoryProtocol;

  constructor(animalRepository: AnimalsCensusRepositoryProtocol) {
    this.animalRepository = animalRepository;
  }
  async execute(): Promise<
    Either<Error, Array<AnimalsConsumptionData> | null>
  > {
    const data = await this.animalRepository.getConsumption();
    return right(data);
  }
}
