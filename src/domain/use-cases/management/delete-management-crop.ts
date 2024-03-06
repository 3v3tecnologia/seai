import { Either, left, right } from "../../../shared/Either";
import { ManagementCrop } from "../../entities/management/management-crop";
import { ManagementCropRepository } from "../_ports/repositories/management-crop-repository";
import { DeleteManagementCropDTO } from "./dto/delete-management-crop.dto";
import { ManagementCropErrors } from "./errors/management-crop-errors";

export class DeleteManagementCropUseCase {
  private cropRepository: ManagementCropRepository;

  constructor(cultureRepository: ManagementCropRepository) {
    this.cropRepository = cultureRepository;
  }

  async execute(
    request: DeleteManagementCropUseCaseProtocol.Request
  ): DeleteManagementCropUseCaseProtocol.Response {
    const notFound = (await this.cropRepository.exists(request.id)) === false;

    if (notFound) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    await this.cropRepository.delete(request.id);

    return right(true);
  }
}

export namespace DeleteManagementCropUseCaseProtocol {
  export type Request = DeleteManagementCropDTO.Input;

  export type Response = Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      DeleteManagementCropDTO.Output
    >
  >;
}
