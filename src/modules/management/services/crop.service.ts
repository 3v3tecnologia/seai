import { Either, left, right } from "../../../shared/Either";
import { UserCommandOperationProps } from "../../UserOperations/protocols/logger";
import { ManagementCropErrors } from "../core/errors/crop-errors";
import { ManagementCrop } from "../core/model/crop";
import {
  ManagementCropCycle,
  checkCropCycleSequence,
} from "../core/model/crop-cycles";
import { IManagementCropsRepository } from "../repositories/protocols/management-crop.repository";
import { IManagementCropsServices } from "./protocols/management-crops";

export class ManagementCropsServices implements IManagementCropsServices {
  constructor(
    private cropRepository: IManagementCropsRepository,
  ) {}

  async createCrop(
    data: {
      Name: string;
      LocationName: string | null;
      CreatedAt?: string;
      UpdatedAt?: string;
    },
    author: number
  ): Promise<Either<ManagementCropErrors.CropAlreadyExistsError, number>> {
    const { LocationName, Name } = data;

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

    const cropId = await this.cropRepository.create(crop, author);

    if (cropId === null) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    return right(cropId);
  }

  async deleteCrop(
    id: number,
    operation: UserCommandOperationProps
  ): Promise<Either<ManagementCropErrors.CropAlreadyExistsError, boolean>> {
    const notFound = (await this.cropRepository.idExists(id)) === false;

    if (notFound) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    await this.cropRepository.delete(id, operation);

    return right(true);
  }

  async getAllCrops(params: { Name?: string }): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      Array<{
        Id: number;
        Name: string;
        LocationName: string | null;
      }> | null
    >
  > {
    if (params?.Name) {
      return right(
        await this.cropRepository.findCropByName(params.Name as string)
      );
    }
    return right(await this.cropRepository.find());
  }

  async getCropById(id: number): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      {
        Id: number;
        Name: string;
        LocationName: string | null;
      } | null
    >
  > {
    return right(await this.cropRepository.findCropById(id));
  }

  async updateCrop(
    data: {
      Id: number;
      Name: string;
      LocationName: string | null;
    },
    operation: UserCommandOperationProps
  ): Promise<Either<ManagementCropErrors.CropAlreadyExistsError, void>> {
    // Id or name?
    const exists = await this.cropRepository.idExists(data.Id);

    if (!exists) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }
    // Id or name?
    const cropWithSameName =
      await this.cropRepository.checkIfCropNameAlreadyExists(data.Name);

    if (cropWithSameName && cropWithSameName.Id !== data.Id) {
      return left(new ManagementCropErrors.CropAlreadyExistsError(data.Name));
    }

    const cultureOrError = ManagementCrop.create({
      Id: data.Id,
      LocationName: data.LocationName,
      Name: data.Name,
    });

    if (cultureOrError.isLeft()) {
      return left(cultureOrError.value);
    }

    const culture = cultureOrError.value as ManagementCrop;

    const cultureId = await this.cropRepository.update(culture, operation);

    if (cultureId === null) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    return right();
  }

  async insertCropCycles(
    {
      cycles,
      idCrop,
    }: {
      idCrop: number;
      cycles: Array<ManagementCropCycle>;
    },
    author: number
  ): Promise<Either<ManagementCropErrors.CropNotExistsError, any>> {
    const validCyclesOrError = checkCropCycleSequence(cycles);

    if (validCyclesOrError.isLeft()) {
      return left(validCyclesOrError.value);
    }

    const notFound = (await this.cropRepository.idExists(idCrop)) === false;

    if (notFound) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    await this.cropRepository.createCropCycles({ idCrop, cycles }, author);

    return right(`Sucesso ao atualizar ciclos do cultivar ${idCrop}.`);
  }

  // Useless?
  async deleteCropCyclesByCropId(
    idCrop: number,
    operation: UserCommandOperationProps
  ): Promise<Either<ManagementCropErrors.CropNotExistsError, any>> {
    const notFound = (await this.cropRepository.idExists(idCrop)) === false;

    if (notFound) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    await this.cropRepository.deleteCropCycles(idCrop, operation);

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
