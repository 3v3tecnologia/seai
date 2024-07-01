import { Either } from "../../../../shared/Either";
import { ManagementCropErrors } from "../../core/errors/crop-errors";
import { ManagementCropCycle } from "../../core/model/crop-cycles";
import { ManagementCropDTO } from "../dto/crop";

export interface IManagementCropsServices {
  createCrop(
    params: ManagementCropDTO.CreateCrop.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.CreateCrop.Output
    >
  >;
  deleteCrop(
    id: ManagementCropDTO.DeleteCrop.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.DeleteCrop.Output
    >
  >;
  getCropById(
    id: ManagementCropDTO.GetCrop.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.GetCrop.Output
    >
  >;
  getAllCrops(
    params: ManagementCropDTO.GetAllCrops.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.GetAllCrops.Output
    >
  >;
  updateCrop(
    params: ManagementCropDTO.UpdateCrop.Input
  ): Promise<
    Either<
      ManagementCropErrors.CropAlreadyExistsError,
      ManagementCropDTO.UpdateCrop.Output
    >
  >;
  insertCropCycles(
    idCrop: number,
    cycles: Array<ManagementCropCycle>
  ): Promise<Either<ManagementCropErrors.CropNotExistsError, any>>;

  deleteCropCyclesByCropId(
    idCrop: number
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
