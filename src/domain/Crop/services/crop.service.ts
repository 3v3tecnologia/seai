import { Either, left, right } from "../../../shared/Either";
import { ManagementCropErrors } from "../core/crop-errors";
import { ManagementCrop, ManagementCropParams } from "../core/model/crop";
import { ManagementCropCycle } from "../core/model/crop-cycles";
import { IManagementCropsRepository } from "../infra/repository/protocol/management-crop.repository";
import { DeleteCropInput, InsertCropCommand, UpdateCropInput } from "./crop-dto";
import { IManagementCropsServices } from "./crop.service.protocol";


export class ManagementCropsServices implements IManagementCropsServices {
  constructor(private cropRepository: IManagementCropsRepository) { }

  async update({ audit, data }: UpdateCropInput): Promise<Either<ManagementCropErrors.CropAlreadyExistsError, void>> {
    const exists = await this.cropRepository.idExists(data.Id);

    if (!exists) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }
    const cropWithSameName =
      await this.cropRepository.checkIfCropNameAlreadyExists(data.Name);

    if (cropWithSameName && cropWithSameName.Id !== data.Id) {
      return left(new ManagementCropErrors.CropAlreadyExistsError(data.Name));
    }

    const cultureOrError = ManagementCrop.create({
      Id: data.Id,
      IsPermanent: data.IsPermanent,
      Name: data.Name,
      Cycles: data.Cycles,
      CycleRestartPoint: data.CycleRestartPoint
    });

    if (cultureOrError.isLeft()) {
      return left(cultureOrError.value);
    }

    const culture = cultureOrError.value as ManagementCrop;

    await this.cropRepository.update(culture, audit);

    return right();
  }

  async create(input: InsertCropCommand): Promise<Either<ManagementCropErrors.CropAlreadyExistsError, number>> {
    const { data: { IsPermanent, Name, Cycles, CycleRestartPoint }, audit } = input;

    const alreadyExists = await this.cropRepository.nameExists(Name);

    if (alreadyExists) {
      return left(new ManagementCropErrors.CropAlreadyExistsError(Name));
    }

    const cropOrError = ManagementCrop.create({
      IsPermanent,
      Name,
      Cycles,
      CycleRestartPoint
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

  async setRestartCyclePoint(id_crop: number, id_cycle: number): Promise<Either<Error, void>> {
    const crop = await this.cropRepository.findCropById(id_crop)

    if (crop === null) {
      return left(new ManagementCropErrors.CropNotExistsError());
    }

    if (crop.IsPermanent == false) {
      return left(new Error("É necessário definir a cultura sendo perene."));
    }

    const cycle = await this.cropRepository.findCropsCycles(id_crop)

    const validCycleIdentification = cycle.some((cycle) => cycle.Id === id_cycle)

    if (validCycleIdentification) {
      await this.cropRepository.addRestartCyclePoint(id_crop, id_cycle)
      return right()
    }

    return left(new Error("Identificador do ciclo da cultura inválido."))
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

    // const withIrrigation = await this.cropRepository.checkIfThereIsIrrigation(
    //   id
    // );

    // if (withIrrigation) {
    //   return left(new ManagementCropErrors.AssociatedWithIrrigation());
    // }

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
        CycleRestartPoint: number;
      }>
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
      Required<ManagementCropParams> | null
    >
  > {
    const crop = await this.cropRepository.findCropById(id)
    if (crop) {
      const { Id, Name, IsPermanent, Cycles, CycleRestartPoint } = crop

      return right({ Id: Id as number, Name, IsPermanent, Cycles, CycleRestartPoint: CycleRestartPoint as number });

    }
    return right(null);
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
