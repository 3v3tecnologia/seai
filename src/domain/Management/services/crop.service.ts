import { Either, left, right } from "../../../shared/Either";
import { ManagementCropErrors } from "../core/errors/crop-errors";
import { ManagementCrop } from "../core/model/crop";
import {
  ManagementCropCycle,
  checkCropCycleSequence,
} from "../core/model/crop-cycles";
import { IManagementCropsRepository } from "../repositories/protocols/management-crop.repository";
import { DeleteCropCycles, DeleteCropInput, InsertCropCommand, InsertCropCycles, UpdateCropInput } from "./dto/crop";
import { IManagementCropsServices } from "./protocols/management-crops";

export class ManagementCropsServices implements IManagementCropsServices {
  constructor(private cropRepository: IManagementCropsRepository) { }

  async update({ audit, data }: UpdateCropInput): Promise<Either<ManagementCropErrors.CropAlreadyExistsError, void>> {
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
      IsPermanent: data.IsPermanent,
      CycleRestartPoint: data.CycleRestartPoint,
      Name: data.Name,
      Cycles: data.Cycles
    });

    if (cultureOrError.isLeft()) {
      return left(cultureOrError.value);
    }

    const culture = cultureOrError.value as ManagementCrop;

    await this.cropRepository.update(culture, audit);

    return right();
  }

  async create(input: InsertCropCommand): Promise<Either<ManagementCropErrors.CropAlreadyExistsError, number>> {
    const { data: { CycleRestartPoint, IsPermanent, Name, Cycles }, audit } = input;

    const alreadyExists = await this.cropRepository.nameExists(Name);

    if (alreadyExists) {
      return left(new ManagementCropErrors.CropAlreadyExistsError(Name));
    }

    const cropOrError = ManagementCrop.create({
      CycleRestartPoint,
      IsPermanent,
      Name,
      Cycles
    });

    if (cropOrError.isLeft()) {
      return left(cropOrError.value);
    }

    const crop = cropOrError.value as ManagementCrop;

    const cropId = await this.cropRepository.create(crop, audit.author);

    if (!cropId) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    return right(cropId);
  }

  async deleteCrop(input: DeleteCropInput
  ): Promise<Either<Error, boolean>> {
    const { data: {
      id
    }, audit } = input

    const notFound = (await this.cropRepository.idExists(id)) === false;

    if (notFound) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    const withIrrigation = await this.cropRepository.checkIfThereIsIrrigation(
      id
    );

    if (withIrrigation) {
      return left(new ManagementCropErrors.AssociatedWithIrrigation());
    }

    await this.cropRepository.delete(id, audit);

    return right(true);
  }

  async getAllCrops(params: { Name?: string }): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      Array<{
        Id: number;
        Name: string;
        IsPermanent: boolean;
        CycleRestartPoint: string;
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
      ManagementCrop | null
    >
  > {
    return right(await this.cropRepository.findCropById(id));
  }

  async insertCropCycles({ audit, data }: InsertCropCycles): Promise<Either<ManagementCropErrors.CropNotExistsError, any>> {

    const { cycles, id } = data

    const { author } = audit

    const validCyclesOrError = checkCropCycleSequence(cycles);

    if (validCyclesOrError.isLeft()) {
      return left(validCyclesOrError.value);
    }

    const notFound = (await this.cropRepository.idExists(id)) === false;

    if (notFound) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    const crop = await this.cropRepository.findCropById(data.id);

    if (crop?.IsPermanent) {
      const restartPointNotIncluded = cycles.some((item) => item.Title === crop?.CycleRestartPoint) === false

      if (restartPointNotIncluded) {
        return left(new Error("Necessário informar um valor válido para o estágio de reinício do cíclo da cultura."))
      }
    }


    await this.cropRepository.createCropCycles({ id, cycles }, author);

    return right(`Sucesso ao atualizar ciclos do cultivar ${id}.`);
  }

  // Useless?
  async deleteCropCyclesByCropId({ audit, data }: DeleteCropCycles
  ): Promise<Either<ManagementCropErrors.CropNotExistsError, any>> {
    const { id } = data

    const notFound = (await this.cropRepository.idExists(id)) === false;

    if (notFound) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    await this.cropRepository.deleteCropCycles(id, audit);

    return right(
      `Sucesso ao apagar dados de ciclo de cultura do cultivar ${id}`
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
