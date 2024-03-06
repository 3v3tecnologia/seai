import { Either, left, right } from "../../../shared/Either";
import { ManagementCrop } from "../../entities/management/management-crop";
import { ManagementCropRepository } from "../_ports/repositories/management-crop-repository";
import { UpdateManagementCropDTO } from "./dto/update-management-crop.dto";
import { ManagementCropErrors } from "./errors/management-crop-errors";

export class UpdateManagementCropUseCase {
  private cropRepository: ManagementCropRepository;

  constructor(cultureRepository: ManagementCropRepository) {
    this.cropRepository = cultureRepository;
  }

  async execute(
    request: UpdateManagementCropUseCaseProtocol.Request
  ): UpdateManagementCropUseCaseProtocol.Response {
    // Id or name?
    const alreadyExists = await this.cropRepository.exists(request.name);

    if (alreadyExists) {
      return left(
        new ManagementCropErrors.CropAlreadyExistsError(request.name)
      );
    }

    const cultureOrError = ManagementCrop.create({
      cycles: request.cycles,
      locationName: request.locationName,
      name: request.name,
    });

    if (cultureOrError.isLeft()) {
      return left(cultureOrError.value);
    }

    const culture = cultureOrError.value as ManagementCrop;

    const cultureId = await this.cropRepository.update(culture);

    if (cultureId === null) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    return right();
  }
}

export namespace UpdateManagementCropUseCaseProtocol {
  export type Request = UpdateManagementCropDTO.Input;

  export type Response = Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      UpdateManagementCropDTO.Output
    >
  >;
}
