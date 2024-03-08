import { Either } from "../../../../../shared/Either";
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

  export interface GetAll {
    getAll(): Promise<
      Either<
        ManagementCropErrors.CropAlreadyExistsError,
        ManagementCropDTO.GetAll.Output | null
      >
    >;
  }

  export interface GetById {
    getById(
      params: ManagementCropDTO.GetById.Input
    ): Promise<
      Either<
        ManagementCropErrors.CropAlreadyExistsError,
        ManagementCropDTO.GetById.Output
      >
    >;
  }
}
