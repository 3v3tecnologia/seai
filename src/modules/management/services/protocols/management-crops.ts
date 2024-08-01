import { Either } from "../../../../shared/Either";
import { UserCommandOperationProps } from "../../../UserOperations/protocols/logger";
import { ManagementCropErrors } from "../../core/errors/crop-errors";
import { ManagementCropCycle } from "../../core/model/crop-cycles";

export interface IManagementCropsServices {
  createCrop(
    data: {
      Name: string;
      LocationName: string | null;
      CreatedAt?: string;
      UpdatedAt?: string;
    },
    author: number
  ): Promise<Either<ManagementCropErrors.CropAlreadyExistsError, number>>;
  deleteCrop(
    id: number,
    operation: UserCommandOperationProps
  ): Promise<Either<ManagementCropErrors.CropAlreadyExistsError, boolean>>;
  getCropById(id: number): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      {
        Id: number;
        Name: string;
        LocationName: string | null;
      } | null
    >
  >;
  getAllCrops(params: { Name?: string }): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      Array<{
        Id: number;
        Name: string;
        LocationName: string | null;
      }> | null
    >
  >;
  updateCrop(
    data: {
      Id: number;
      Name: string;
      LocationName: string | null;
    },
    operation: UserCommandOperationProps
  ): Promise<Either<ManagementCropErrors.CropAlreadyExistsError, void>>;
  insertCropCycles(
    {
      cycles,
      idCrop,
    }: {
      idCrop: number;
      cycles: Array<ManagementCropCycle>;
    },
    author: number
  ): Promise<Either<ManagementCropErrors.CropNotExistsError, any>>;

  deleteCropCyclesByCropId(
    idCrop: number,
    operation: UserCommandOperationProps
  ): Promise<Either<ManagementCropErrors.CropNotExistsError, any>>;

  findCropCyclesByCropId(
    idCrop: number
  ): Promise<
    Either<
      ManagementCropErrors.CropNotExistsError,
      Array<ManagementCropCycle> | null
    >
  >;
}
