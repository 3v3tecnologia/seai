import { Either, left, right } from "../../../shared/Either";
import { ManagementCrop } from "../entities/crop";
import { ManagementCropErrors } from "../errors/management-crop-errors";
import { DbManagementCropRepository } from "../infra/database/repositories/management-crop.repository";
import { ManagementCropDTO } from "../ports/crop/dto";

export class ManagementCropUseCases {
  static async create(
    params: ManagementCropDTO.Create.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.Create.Output
    >
  > {
    const { Cycles, LocationName, Name } = params;

    const alreadyExists = await DbManagementCropRepository.nameExists(Name);

    if (alreadyExists) {
      return left(new ManagementCropErrors.CropAlreadyExistsError(Name));
    }

    const cultureOrError = ManagementCrop.create({
      Cycles,
      LocationName,
      Name,
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

  static async getAll(
    params: { name: string } | void
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.GetAll.Output
    >
  > {
    if (params?.name) {
      return right(
        await DbManagementCropRepository.findCropByName(params.name as string)
      );
    }
    return right(await DbManagementCropRepository.find());
  }

  static async getCropById(
    params: ManagementCropDTO.GetCrop.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.GetCrop.Output
    >
  > {
    return right(
      await DbManagementCropRepository.findCropById(params.id as number)
    );
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
    const exists = await DbManagementCropRepository.idExists(params.Id);

    if (!exists) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }
    // Id or name?
    const cropWithSameName =
      await DbManagementCropRepository.checkIfCropNameAlreadyExists(
        params.Name
      );

    if (cropWithSameName && cropWithSameName.Id !== params.Id) {
      return left(new ManagementCropErrors.CropAlreadyExistsError(params.Name));
    }

    const cultureOrError = ManagementCrop.create({
      Id: params.Id,
      Cycles: params.Cycles,
      LocationName: params.LocationName,
      Name: params.Name,
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
