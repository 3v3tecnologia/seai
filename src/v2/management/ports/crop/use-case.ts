import { Either } from "../../../../shared/Either";
import { ManagementCropErrors } from "../../errors/management-crop-errors";
import { ManagementCropDTO } from "./dto";

export namespace CropUseCaseProtocol {
  export interface Create {
    create(
      params: ManagementCropDTO.Create.Input
    ): Promise<
      Either<
        ManagementCropErrors.CropAlreadyExistsError,
        ManagementCropDTO.Create.Output
      >
    >;
  }
  export interface Update {
    update(
      params: ManagementCropDTO.Update.Input
    ): Promise<
      Either<
        ManagementCropErrors.CropAlreadyExistsError,
        ManagementCropDTO.Update.Output
      >
    >;
  }

  export interface Delete {
    delete(
      params: ManagementCropDTO.Delete.Input
    ): Promise<
      Either<
        ManagementCropErrors.CropAlreadyExistsError,
        ManagementCropDTO.Delete.Output
      >
    >;
  }

  export interface GetById {
    getById(
      params: ManagementCropDTO.GetCrop.Input
    ): Promise<
      Either<
        ManagementCropErrors.CropAlreadyExistsError,
        ManagementCropDTO.GetCrop.Output
      >
    >;
  }
}
