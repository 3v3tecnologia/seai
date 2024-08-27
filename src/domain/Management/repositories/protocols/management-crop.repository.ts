import { UserCommandOperationProps } from "../../../Logs/protocols/logger";
import { ManagementCrop, ManagementCropParams } from "../../core/model/crop";
import { ManagementCropCycle } from "../../core/model/crop-cycles";

export interface IManagementCropsRepository {
  create(culture: ManagementCrop, author: number): Promise<number | undefined>;
  checkIfStageExists(stage: string): Promise<boolean>
  checkIfCycleExists(id_crop: number, id_cycle: number): Promise<boolean>
  update(
    culture: ManagementCrop,
    operation: UserCommandOperationProps
  ): Promise<void>;

  nameExists(crop: string | number): Promise<boolean>;

  idExists(crop: string | number): Promise<boolean>;

  delete(idCrop: number, operation: UserCommandOperationProps): Promise<void>;

  findByBasin(id: number): Promise<Array<string> | null>;

  findCropById(id: number): Promise<ManagementCrop | null>

  addRestartCyclePoint(id_crop: number, id_cycle: number): Promise<void>

  findCropsCycles(idCrop: number): Promise<Array<ManagementCropCycle>>;

  findCropByName(name: string): Promise<Array<Required<Omit<ManagementCropParams, 'Cycles'>>> | null>

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

  find(): Promise<Array<Required<Omit<ManagementCropParams, 'Cycles'>>> | null>

  checkIfCropNameAlreadyExists(
    name: string
  ): Promise<Omit<ManagementCropParams, 'Cycles'> | null>

  checkIfThereIsIrrigation(id: number): Promise<boolean>;

}
