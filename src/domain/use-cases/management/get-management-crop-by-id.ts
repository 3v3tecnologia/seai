import { Either, right } from "../../../shared/Either";
import { ManagementCropRepository } from "../_ports/repositories/management-crop-repository";
import { GetManagementCropByIdDTO } from "./dto/get-management-crop-by-id-dto";
import { ManagementCropErrors } from "./errors/management-crop-errors";

export class GetManagementCropByIdUseCase {
  private cropRepository: ManagementCropRepository;

  constructor(cultureRepository: ManagementCropRepository) {
    this.cropRepository = cultureRepository;
  }

  async execute(
    request: GetManagementCropByIdUseCaseProtocol.Request
  ): GetManagementCropByIdUseCaseProtocol.Response {
    const crop = await this.cropRepository.findCropById(request.id);
    return right(crop);
  }
}

export namespace GetManagementCropByIdUseCaseProtocol {
  export type Request = GetManagementCropByIdDTO.Input;

  export type Response = Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      GetManagementCropByIdDTO.Output
    >
  >;
}
