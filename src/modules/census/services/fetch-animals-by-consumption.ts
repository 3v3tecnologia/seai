import { Either, right } from "../../../shared/Either";
import {
  AnimalsConsumptionData,
  AnimalsCensusRepositoryProtocol,
} from "../infra/repositories/protocols/animal-census-repository";

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
