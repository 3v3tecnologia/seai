import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../../shared/utils/pagination";
import { Either } from "../../../../shared/Either";
import { UserCommandOperationProps } from "../../../Logs/protocols/logger";
import { EquipmentEntity } from "../../core/models/Equipment";
import { MeteorologicalOrganEntity } from "../../core/models/MetereologicalOrgan";
import { AuditableInput, PaginatedInput } from "../../../../shared/utils/command";

export interface IEquipmentsServices {
  insert(request: {
    IdEquipmentExternal: string;
    Name: string;
    Fk_Organ: number;
    Fk_Type: number;
    Altitude: number;
    Location: {
      Name: string;
      Coordinates: Array<number>;
    };
    Enable: boolean;
  }): Promise<Either<Error, number | null>>;
  bulkInsert(
    equipments: Array<any>,
    id_organ: number
  ): Promise<Either<Error, Array<{ Code: string; Id: number }>>>;

  getAllEquipmentsTypes(): Promise<
    Either<
      Error,
      Array<{
        Type: string;
        Name: number;
      }>
    >
  >;

  getAll(
    request: PaginatedInput<{
      equipmentId?: number;
      idOrgan?: number;
      idType?: number;
      name?: string;
      enabled?: boolean;
      only_with_measurements?: boolean;
    }>
  ): Promise<
    Either<
      Error,
      IOutputWithPagination<EquipmentEntity> | EquipmentEntity | null
    >
  >

  update(
    request: AuditableInput<{
      IdEquipment: number;
      Enable: boolean;
    }>): Promise<Either<Error, string>>

  getByType(
    type: "station" | "pluviometer"
  ): Promise<Either<Error, Array<any> | null>>;

  getMeteorologicalOrganCredentials(
    organName: string
  ): Promise<Either<Error, any | null>>;

  getDateOfLastMeasurementTaken(): Promise<Either<Error, Array<any> | null>>;

  getMeteorologicalOrgans(): Promise<
    Either<Error, Array<Omit<MeteorologicalOrganEntity, "Password">> | null>
  >;

  fetchWithYesterDayMeasurements(
    request: {
      type: "station" | "pluviometer";
    } & {
      latitude?: number;
      longitude?: number;
      distance?: number;
    }
  ): Promise<Either<Error, Array<any> | null>>;
}
