import { Either } from "../../../../shared/Either";
import { UserCommandOperationProps } from "../../../Logs/protocols/logger";
import { ManagementCropErrors } from "../../core/errors/crop-errors";
import { ManagementCropCycle } from "../../core/model/crop-cycles";
import { InsertCropCommand, DeleteCropInput, UpdateCropInput, InsertCropCycles, DeleteCropCycles } from "../dto/crop";

export interface IManagementCropsServices {
  createCrop(input: InsertCropCommand): Promise<Either<ManagementCropErrors.CropAlreadyExistsError, number>>;
  deleteCrop(input: DeleteCropInput
  ): Promise<Either<Error, boolean>>
  getCropById(id: number): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      {
        Id: number;
        Name: string;
        IsPermanent: boolean;
        CycleRestartPoint: string;
      } | null
    >
  >;
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
  updateCrop(input: UpdateCropInput): Promise<Either<ManagementCropErrors.CropAlreadyExistsError, void>>;
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
