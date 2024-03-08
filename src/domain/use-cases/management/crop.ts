import { Either, left, right } from "../../../shared/Either";
import { ManagementCrop } from "../../entities/management/management-crop";
import { ManagementCropRepository } from "../_ports/repositories/management-crop-repository";
import { ManagementCropErrors } from "./errors/management-crop-errors";

import { ManagementCropDTO } from "./ports/crop/dto";
import { CropUseCaseProtocol } from "./ports/crop/use-case";

export class CropUseCases
  implements
    CropUseCaseProtocol.Create,
    CropUseCaseProtocol.Delete,
    CropUseCaseProtocol.GetAll,
    CropUseCaseProtocol.GetById
{
  private _repository: ManagementCropRepository;

  constructor(repository: ManagementCropRepository) {
    this._repository = repository;
  }

  async create(
    params: ManagementCropDTO.Create.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.Create.Output
    >
  > {
    const { cycles, locationName, name } = params;

    const alreadyExists = await this._repository.nameExists(name);

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

    const cultureId = await this._repository.create(culture);

    if (cultureId === null) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    return right(cultureId);
  }

  async delete(
    params: ManagementCropDTO.Delete.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.Delete.Output
    >
  > {
    const notFound = (await this._repository.idExists(params.id)) === false;

    if (notFound) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    await this._repository.delete(params.id);

    return right(true);
  }

  async getAll(): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.GetAll.Output
    >
  > {
    const crops = await this._repository.find();
    return right(crops);
  }

  async getById(
    params: ManagementCropDTO.GetById.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.GetById.Output
    >
  > {
    const crop = await this._repository.findCropById(params.id);
    return right(crop);
  }

  async update(
    params: ManagementCropDTO.Update.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.Update.Output
    >
  > {
    // Id or name?
    const exists = await this._repository.idExists(params.id);

    if (!exists) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    // Id or name?
    const cropWithSameName = await this._repository.findCropByName(params.name);

    if (cropWithSameName && cropWithSameName.id !== params.id) {
      return left(new ManagementCropErrors.CropAlreadyExistsError(params.name));
    }

    const cultureOrError = ManagementCrop.create({
      id: params.id,
      cycles: params.cycles,
      locationName: params.locationName,
      name: params.name,
    });

    if (cultureOrError.isLeft()) {
      return left(cultureOrError.value);
    }

    const culture = cultureOrError.value as ManagementCrop;

    const cultureId = await this._repository.update(culture);

    if (cultureId === null) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    return right();
  }
}
