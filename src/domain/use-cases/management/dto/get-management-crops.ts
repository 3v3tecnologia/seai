import { ManagementCrop } from "../../../entities/management/management-crop";

export namespace GetManagementCropsDTO {
  export type Input = void;
  export type Output = Array<ManagementCrop>;
}
