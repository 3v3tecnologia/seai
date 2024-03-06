import { Either, left, right } from "../../../shared/Either";
import { ManagementCrop } from "../../entities/management/management-crop";
import { ManagementCropRepository } from "../_ports/repositories/management-crop-repository";
import { CreateManagementCropDTO } from "./dto/create-management-crop-dto";
import { ManagementCropErrors } from "./errors/management-crop-errors";

export class CreateManagementCropUseCase {
  private cropRepository: ManagementCropRepository;

  constructor(cultureRepository: ManagementCropRepository) {
    this.cropRepository = cultureRepository;
  }

  async execute(
    request: CreateManagementCropUseCaseProtocol.Request
  ): CreateManagementCropUseCaseProtocol.Response {
    const { cycles, locationName, name } = request;

    const alreadyExists = await this.cropRepository.exists(request.name);

    if (alreadyExists) {
      return left(new ManagementCropErrors.CropAlreadyExistsError(name));
    }

    const cultureOrError = ManagementCrop.create({
      cycles,
      locationName,
      name,
    });

    if (cultureOrError.isLeft()) {
      return left(cultureOrError.value);
    }

    const culture = cultureOrError.value as ManagementCrop;

    const cultureId = await this.cropRepository.create(culture);

    if (cultureId === null) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    return right(cultureId);
  }
}

export namespace CreateManagementCropUseCaseProtocol {
  export type Request = CreateManagementCropDTO.Input;

  export type Response = Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      CreateManagementCropDTO.Output
    >
  >;
}
