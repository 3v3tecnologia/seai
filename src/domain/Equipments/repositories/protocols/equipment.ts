import {
  EquipmentEntity,
  PluviometerWithLastMeasurement,
  StationWithLastMeasurement,
} from "../../core/models/Equipment";
import { MeteorologicalOrganEntity } from "../../core/models/MetereologicalOrgan";
import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../../shared/utils/pagination";
import { UserCommandOperationProps } from "../../../Logs/protocols/logger";
import { PaginatedInput } from "../../../../shared/utils/command";

export interface MeteorologicalOrganRepositoryProtocol {
  checkIfOrganNameAlreadyExists(organName: string): Promise<boolean>;
  checkIfOrganExists(idOrgan: number): Promise<boolean>;
  getMeteorologicalOrgans(): Promise<Array<
    Omit<MeteorologicalOrganEntity, "Password">
  > | null>;
}

export interface IEquipmentsRepository
  extends MeteorologicalOrganRepositoryProtocol {
  insertLastUpdatedAtByOrgan(organId: number): Promise<void>;
  getDateOfLastMeasurementTaken(): Promise<null | Array<{
    Time: string;
    Id_Organ: number;
  }>>;
  getTypes(): Promise<
    Array<{
      Type: string;
      Name: number;
    }>
  >;
  getOrganByName(organName: string): Promise<{
    Id: number;
  } | null>;
  getByType(type: string): Promise<
    Array<{
      IdEquipmentExternal: string;
      Name: string;
      Altitude: number | null;
      Location: {
        Latitude: number;
        Longitude: number;
      } | null;
      FK_Organ: number;
      FK_Type: number;
      Enabled: number;
    }>
  >;
  bulkInsert(
    equipments: Array<any>
  ): Promise<Array<{ Code: string; Id: number }>>;
  getStationCodesWithMeasurements(
    equipmentsCodes: Array<string>,
    time: string
  ): Promise<any>;
  getPluviometersCodesWithMeasurements(
    equipmentsCodes: Array<string>,
    time: string
  ): Promise<any>;

  enableEquipment(
    equipment: {
      IdEquipment: number;
      Enable: boolean;
    },
    operation: UserCommandOperationProps
  ): Promise<void>;
  deleteEquipment(idEquipment: number): Promise<number>;
  checkIfEquipmentCodeAlreadyExists(
    idEquipmentExternal: string
  ): Promise<boolean>;
  checkIfEquipmentTypeExists(idType: number): Promise<boolean>;
  checkIfEquipmentIdExists(id: number): Promise<boolean>;
  getEquipmentIdByExternalCode(
    idEquipmentExternal: string
  ): Promise<number | null>;
  getAllByType(organName: string, eqpType: string): Promise<any>;
  getAll(
    params: PaginatedInput<{
      equipmentId?: number;
      idOrgan?: number;
      idType?: number;
      name?: string;
      enabled?: boolean;
      only_with_measurements?: boolean;
    }>
  ): Promise<IOutputWithPagination<EquipmentEntity>>
  getEquipmentId(id: number): Promise<EquipmentEntity | null>;
  getActivatedPluviometers(
    params: { latitude: number; longitude: number; distance?: number } | null
  ): Promise<Array<PluviometerWithLastMeasurement> | null>
  getActivatedStations(
    params: { latitude: number; longitude: number; distance?: number } | null
  ): Promise<Array<StationWithLastMeasurement> | null>
  getPluviometersWithYesterdayMeasurements(
    params: {
      latitude: number;
      longitude: number;
      distance?: number;
    } | null
  ): Promise<Array<PluviometerWithLastMeasurement> | null>;
  getStationsWithYesterdayMeasurements(
    params: {
      latitude: number;
      longitude: number;
      distance?: number;
    } | null
  ): Promise<Array<StationWithLastMeasurement> | null>;
}
