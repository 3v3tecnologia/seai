import { ManagementCrop, ManagementCropParams } from "../../core/model/crop";
import { ManagementCropCycle } from "../../core/model/crop-cycles";

export interface IManagementCropsRepository {
  create(culture: ManagementCrop): Promise<number | null>;

  update(culture: ManagementCrop): Promise<void>;

  nameExists(crop: string | number): Promise<boolean>;

  idExists(crop: string | number): Promise<boolean>;

  delete(idCulture: number): Promise<void>;

  findByBasin(id: number): Promise<Array<string> | null>;

  findCropById(
    id: number
  ): Promise<{ Id: number; Name: string; LocationName: string | null } | null>;

  findCropsCycles(idCrop: number): Promise<Array<ManagementCropCycle> | null>;

  findCropByName(name: string): Promise<Array<{
    Id: number;
    Name: string;
    LocationName: string | null;
  }> | null>;

  deleteCropCycles(idCrop: number): Promise<void>;

  createCropCycles(
    idCrop: number,
    cycles: Array<ManagementCropCycle>
  ): Promise<void>;

  find(): Promise<Array<{
    Id: number;
    Name: string;
    LocationName: string | null;
  }> | null>;

  checkIfCropNameAlreadyExists(
    name: string
  ): Promise<ManagementCropParams | null>;

  // findAllCrops(): Promise<Array<{
  //   Id: number;
  //   Name: string;
  //   LocationName: string | null;
  // }> | null>;
}
