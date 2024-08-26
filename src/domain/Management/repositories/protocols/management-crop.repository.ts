import { UserCommandOperationProps } from "../../../Logs/protocols/logger";
import { ManagementCrop, ManagementCropParams } from "../../core/model/crop";
import { ManagementCropCycle } from "../../core/model/crop-cycles";

export interface IManagementCropsRepository {
  create(culture: ManagementCrop, author: number): Promise<number | undefined>;
  checkIfStageExists(stage: string): Promise<boolean>
  update(
    culture: ManagementCrop,
    operation: UserCommandOperationProps
  ): Promise<void>;

  nameExists(crop: string | number): Promise<boolean>;

  idExists(crop: string | number): Promise<boolean>;

  delete(idCrop: number, operation: UserCommandOperationProps): Promise<void>;

  findByBasin(id: number): Promise<Array<string> | null>;

  findCropById(id: number): Promise<ManagementCrop | null>

  findCropsCycles(idCrop: number): Promise<Array<ManagementCropCycle> | null>;

  findCropByName(name: string): Promise<Array<{
    Id: number;
    Name: string;
    IsPermanent: boolean;
    CycleRestartPoint: string;
  }> | null>;

  deleteCropCycles(
    idCrop: number,
    operation: UserCommandOperationProps
  ): Promise<void>;

  createCropCycles(
    data: {
      id: number;
      cycles: Array<ManagementCropCycle>;
    },
    author: number
  ): Promise<void>;

  find(): Promise<Array<{
    Id: number;
    Name: string;
    IsPermanent: boolean;
    CycleRestartPoint: string;
  }> | null>;

  checkIfCropNameAlreadyExists(
    name: string
  ): Promise<Omit<ManagementCropParams, 'Cycles'> | null>

  checkIfThereIsIrrigation(id: number): Promise<boolean>;
  // findAllCrops(): Promise<Array<{
  //   Id: number;
  //   Name: string;
  //   LocationName: string | null;
  // }> | null>;
}
