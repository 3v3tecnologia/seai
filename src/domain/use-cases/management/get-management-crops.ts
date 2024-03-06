import { Either, right } from "../../../shared/Either";
import { ManagementCropRepository } from "../_ports/repositories/management-crop-repository";
import { GetManagementCropsDTO } from "./dto/get-management-crops";
import { ManagementCropErrors } from "./errors/management-crop-errors";

export class GetManagementCropsUseCase {
  private cropRepository: ManagementCropRepository;

  constructor(cultureRepository: ManagementCropRepository) {
    this.cropRepository = cultureRepository;
  }

  async execute(
    request: GetManagementCropsUseCaseProtocol.Request
  ): GetManagementCropsUseCaseProtocol.Response {
    const crops = await this.cropRepository.find();
    return right(crops);
  }
}

export namespace GetManagementCropsUseCaseProtocol {
  export type Request = void;

  export type Response = Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      GetManagementCropsDTO.Output | null
    >
  >;
}
