import { DbManagementCropRepository } from "../../../infra/database/postgres/repositories/management-crop.repository";
import { Either, left, right } from "../../../shared/Either";
import { ManagementCrop } from "../../entities/management/management-crop";
import { ManagementCropErrors } from "./errors/management-crop-errors";

import { ManagementCropDTO } from "./ports/crop/dto";

export class ManagementCropUseCases {
  static async create(
    params: ManagementCropDTO.Create.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.Create.Output
    >
  > {
    const { cycles, locationName, name } = params;

    const alreadyExists = await DbManagementCropRepository.nameExists(name);

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

    const cultureId = await DbManagementCropRepository.create(culture);

    if (cultureId === null) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    return right(cultureId);
  }

  static async delete(
    params: ManagementCropDTO.Delete.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.Delete.Output
    >
  > {
    const notFound =
      (await DbManagementCropRepository.idExists(params.id)) === false;

    if (notFound) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    await DbManagementCropRepository.delete(params.id);

    return right(true);
  }

  static async getAll(): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.GetAll.Output
    >
  > {
    const crops = await DbManagementCropRepository.find();
    return right(crops);
  }

  static async getById(
    params: ManagementCropDTO.GetById.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.GetById.Output
    >
  > {
    const crop = await DbManagementCropRepository.findCropById(params.id);

    return right(crop);
  }

  static async update(
    params: ManagementCropDTO.Update.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.Update.Output
    >
  > {
    // Id or name?
    const exists = await DbManagementCropRepository.idExists(params.id);

    if (!exists) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    // Id or name?
    const cropWithSameName = await DbManagementCropRepository.findCropByName(
      params.name
    );

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

    const cultureId = await DbManagementCropRepository.update(culture);

    if (cultureId === null) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    return right();
  }
}
