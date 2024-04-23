import { Either, left, right } from "../../../shared/Either";
import { ManagementCrop } from "../entities/crop";
import { ManagementCropCycle } from "../entities/crop-cycles";
import { ManagementCropErrors } from "../errors/management-crop-errors";
import { DbManagementCropRepository } from "../infra/database/repositories/management-crop.repository";
import { ManagementCropDTO } from "../ports/crop/dto";

export class ManagementCropUseCases {
  static async createCrop(
    params: ManagementCropDTO.CreateCrop.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.CreateCrop.Output
    >
  > {
    const { LocationName, Name } = params;

    const alreadyExists = await DbManagementCropRepository.nameExists(Name);

    if (alreadyExists) {
      return left(new ManagementCropErrors.CropAlreadyExistsError(Name));
    }

    const cropOrError = ManagementCrop.create({
      LocationName,
      Name,
    });

    if (cropOrError.isLeft()) {
      return left(cropOrError.value);
    }

    const crop = cropOrError.value as ManagementCrop;

    const cropId = await DbManagementCropRepository.createCrop(crop);

    if (cropId === null) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    return right(cropId);
  }

  static async deleteCrop(
    id: ManagementCropDTO.DeleteCrop.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.DeleteCrop.Output
    >
  > {
    const notFound = (await DbManagementCropRepository.idExists(id)) === false;

    if (notFound) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    await DbManagementCropRepository.deleteCrop(id);

    return right(true);
  }

  static async getAllCrops(
    params: ManagementCropDTO.GetAllCrops.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.GetAllCrops.Output
    >
  > {
    if (params?.Name) {
      return right(
        await DbManagementCropRepository.findCropByName(params.Name as string)
      );
    }
    return right(await DbManagementCropRepository.findAllCrops());
  }

  static async getCropById(
    id: ManagementCropDTO.GetCrop.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.GetCrop.Output
    >
  > {
    return right(await DbManagementCropRepository.findCropById(id));
  }

  static async updateCrop(
    params: ManagementCropDTO.UpdateCrop.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.UpdateCrop.Output
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
      LocationName: params.LocationName,
      Name: params.Name,
    });

    if (cultureOrError.isLeft()) {
      return left(cultureOrError.value);
    }

    const culture = cultureOrError.value as ManagementCrop;

    const cultureId = await DbManagementCropRepository.updateCrop(culture);

    if (cultureId === null) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    return right();
  }

  static async insertCropCycles(
    idCrop: number,
    cycles: Array<ManagementCropCycle>
  ): Promise<Either<ManagementCropErrors.CropNotExistsError, any>> {
    const notFound =
      (await DbManagementCropRepository.idExists(idCrop)) === false;

    if (notFound) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    await DbManagementCropRepository.createCropCycles(idCrop, cycles);

    return right(`Sucesso ao atualizar ciclos do cultivar ${idCrop}.`);
  }

  // Useless?
  static async deleteCropCyclesByCropId(
    idCrop: number
  ): Promise<Either<ManagementCropErrors.CropNotExistsError, any>> {
    const notFound =
      (await DbManagementCropRepository.idExists(idCrop)) === false;

    if (notFound) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    await DbManagementCropRepository.deleteCropCycles(idCrop);

    return right(
      `Sucesso ao apagar dados de ciclo de cultura do cultivar ${idCrop}`
    );
  }

  static async findCropCyclesByCropId(
    idCrop: number
  ): Promise<
    Either<
      ManagementCropErrors.CropNotExistsError,
      Array<ManagementCropCycle> | null
    >
  > {
    const notFound =
      (await DbManagementCropRepository.idExists(idCrop)) === false;

    if (notFound) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    const cycles = await DbManagementCropRepository.findCropsCycles(idCrop);

    return right(cycles);
  }
}
