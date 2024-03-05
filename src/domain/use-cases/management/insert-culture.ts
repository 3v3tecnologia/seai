import { left } from "../../../shared/Either";
import { ManagementCulturesRepository } from "../_ports/repositories/cultures-repository";
import { ManagementCultureDTO } from "./dto/management-culture-dto";
import { UnregisteredCultureError } from "./errors/unregistred-culture-error";

export class InsertCultureUseCase {
  private cultureRepository: ManagementCulturesRepository;

  constructor(cultureRepository: ManagementCulturesRepository) {
    this.cultureRepository = cultureRepository;
  }

  async execute(request: InsertCultureUseCaseProtocol.Request) {
    const culture = await this.cultureRepository.findCultureByName(
      request.name
    );

    if (culture == null) {
      return left(new UnregisteredCultureError());
    }
  }
}

export namespace InsertCultureUseCaseProtocol {
  export type Request = ManagementCultureDTO;
  export type Response = any;
}
