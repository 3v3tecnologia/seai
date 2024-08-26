import { Either } from "../../../../shared/Either";
import { ManagementCropErrors } from "../../core/errors/crop-errors";
import { ManagementCrop } from "../../core/model/crop";
import { ManagementCropCycle } from "../../core/model/crop-cycles";
import { DeleteCropCycles, DeleteCropInput, InsertCropCommand, InsertCropCycles, UpdateCropInput } from "../dto/crop";

export interface IManagementCropsServices {
  create(input: InsertCropCommand): Promise<Either<ManagementCropErrors.CropAlreadyExistsError, number>>
  update({ audit, data }: UpdateCropInput): Promise<Either<ManagementCropErrors.CropAlreadyExistsError, void>>
  deleteCrop(input: DeleteCropInput
  ): Promise<Either<Error, boolean>>
  getCropById(id: number): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCrop | null
    >
  >
  getAllCrops(params: { Name?: string }): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      Array<{
        Id: number;
        Name: string;
        IsPermanent: boolean;
        CycleRestartPoint: string;
      }> | null
    >
  >;
  insertCropCycles(input: InsertCropCycles): Promise<Either<ManagementCropErrors.CropNotExistsError, any>>;
  deleteCropCyclesByCropId(input: DeleteCropCycles): Promise<Either<ManagementCropErrors.CropNotExistsError, any>>;
  findCropCyclesByCropId(
    idCrop: number
  ): Promise<
    Either<
      ManagementCropErrors.CropNotExistsError,
      Array<ManagementCropCycle> | null
    >
  >;
}
