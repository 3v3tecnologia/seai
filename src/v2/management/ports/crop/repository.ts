import { ManagementCrop, ManagementCropParams } from "../../entities/crop";

export interface ManagementCropRepository {
  create(culture: ManagementCrop): Promise<number | null>;

  update(culture: ManagementCrop): Promise<void>;

  nameExists(crop: string | number): Promise<boolean>;

  idExists(crop: string | number): Promise<boolean>;

  delete(idCulture: number): Promise<void>;

  findCropById(id: number): Promise<ManagementCropParams | null>;

  findCropByName(name: string): Promise<ManagementCrop | null>;

  find(): Promise<Array<ManagementCropParams> | null>;
}
