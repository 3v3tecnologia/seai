import { AuditableInput } from "../../../../shared/utils/command";
import { ManagementCropParams } from "../../core/model/crop";
import { ManagementCropCycle } from "../../core/model/crop-cycles";


// export type InsertCropCommand = AuditableInput<Omit<ManagementCropParams, "Id" | "Cycles">>

export type InsertCropCommand = AuditableInput<Omit<ManagementCropParams, "Id">>

export type DeleteCropInput = AuditableInput<{
  id: number
}>

// export type UpdateCropInput = AuditableInput<Required<Required<Omit<ManagementCropParams, "Cycles">>>>

export type UpdateCropInput = AuditableInput<Required<ManagementCropParams>>

export type InsertCropCycles = AuditableInput<{
  id: number;
  cycles: Array<ManagementCropCycle>;
}>

export type DeleteCropCycles = AuditableInput<{
  id: number;
}>
