import { ManagementCrop } from "../../../entities/management/management-crop";

export interface ManagementCropRepository {
  create(culture: ManagementCrop): Promise<number | null>;

  update(culture: ManagementCrop): Promise<void>;

  exists(crop: string | number): Promise<boolean>;

  delete(idCulture: number): Promise<void>;

  findCropById(id: number): Promise<ManagementCrop | null>;

  findCropByName(name: string): Promise<ManagementCrop | null>;

  find(): Promise<Array<ManagementCrop> | null>;
}
