import { Either, left, right } from "../../../shared/Either";
import { ManagementCropErrors } from "../core/errors/crop-errors";
import { ManagementCrop } from "../core/model/crop";
import {
  ManagementCropCycle,
  checkCropCycleSequence,
} from "../core/model/crop-cycles";
import { IManagementCropsRepository } from "../repositories/protocols/management-crop.repository";
import { ManagementCropDTO } from "./dto/crop";
import { IManagementCropsServices } from "./protocols/management-crops";

export class ManagementCropsServices implements IManagementCropsServices {
  constructor(private cropRepository: IManagementCropsRepository) {}

  async createCrop(
    params: ManagementCropDTO.CreateCrop.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.CreateCrop.Output
    >
  > {
    const { LocationName, Name } = params;

    const alreadyExists = await this.cropRepository.nameExists(Name);

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

    const cropId = await this.cropRepository.create(crop);

    if (cropId === null) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    return right(cropId);
  }

  async deleteCrop(
    id: ManagementCropDTO.DeleteCrop.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.DeleteCrop.Output
    >
  > {
    const notFound = (await this.cropRepository.idExists(id)) === false;

    if (notFound) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    await this.cropRepository.delete(id);

    return right(true);
  }

  async getAllCrops(
    params: ManagementCropDTO.GetAllCrops.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.GetAllCrops.Output
    >
  > {
    if (params?.Name) {
      return right(
        await this.cropRepository.findCropByName(params.Name as string)
      );
    }
    return right(await this.cropRepository.find());
  }

  async getCropById(
    id: ManagementCropDTO.GetCrop.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.GetCrop.Output
    >
  > {
    return right(await this.cropRepository.findCropById(id));
  }

  async updateCrop(
    params: ManagementCropDTO.UpdateCrop.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.UpdateCrop.Output
    >
  > {
    // Id or name?
    const exists = await this.cropRepository.idExists(params.Id);

    if (!exists) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }
    // Id or name?
    const cropWithSameName =
      await this.cropRepository.checkIfCropNameAlreadyExists(params.Name);

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

    const cultureId = await this.cropRepository.update(culture);

    if (cultureId === null) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    return right();
  }

  async insertCropCycles(
    idCrop: number,
    cycles: Array<ManagementCropCycle>
  ): Promise<Either<ManagementCropErrors.CropNotExistsError, any>> {
    const validCyclesOrError = checkCropCycleSequence(cycles);

    if (validCyclesOrError.isLeft()) {
      return left(validCyclesOrError.value);
    }

    const notFound = (await this.cropRepository.idExists(idCrop)) === false;

    if (notFound) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    await this.cropRepository.createCropCycles(idCrop, cycles);

    return right(`Sucesso ao atualizar ciclos do cultivar ${idCrop}.`);
  }

  // Useless?
  async deleteCropCyclesByCropId(
    idCrop: number
  ): Promise<Either<ManagementCropErrors.CropNotExistsError, any>> {
    const notFound = (await this.cropRepository.idExists(idCrop)) === false;

    if (notFound) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    await this.cropRepository.deleteCropCycles(idCrop);

    return right(
      `Sucesso ao apagar dados de ciclo de cultura do cultivar ${idCrop}`
    );
  }

  async findCropCyclesByCropId(
    idCrop: number
  ): Promise<
    Either<
      ManagementCropErrors.CropNotExistsError,
      Array<ManagementCropCycle> | null
    >
  > {
    const notFound = (await this.cropRepository.idExists(idCrop)) === false;

    if (notFound) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    const cycles = await this.cropRepository.findCropsCycles(idCrop);

    return right(cycles);
  }
}
