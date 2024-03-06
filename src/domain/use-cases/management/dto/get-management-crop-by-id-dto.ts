import { ManagementCrop } from "../../../entities/management/management-crop";

export namespace GetManagementCropByIdDTO {
  export type Input = {
    id: number;
  };
  export type Output = ManagementCrop | null;
}
