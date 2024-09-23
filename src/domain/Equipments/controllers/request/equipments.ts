import { UserOperationControllerDTO } from "../../../../@types/login-user";
import { IPaginationInput } from "../../../../shared/utils/pagination";
import { EquipmentsTypes } from "../../core/models/equipments-types";

export type GetAllEquipmentsRequest = {
  type: `${EquipmentsTypes}`;
};

export type BulkInsertRequest = {
  id_organ: number;
  items: Array<{
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
  }>;
};

export type GetMeteorologicalOrganAccessCredentialRequest = {
  organName: string;
};

export type CreateEquipmentRequest = {
  accountId: number;
  IdEquipmentExternal: string;
  Name: string;
  Altitude: number;
  Location: {
    Name: string;
    Coordinates: Array<number>;
  };
  Fk_Organ: number;
  Fk_Type: number;
  Enable: boolean;
};

export type GetSyncronizedEquipmentsRequest = {
  type: `${EquipmentsTypes}`;
} & {
  latitude?: number;
  longitude?: number;
  distance?: number;
};

export type FetchActivatedEquipmentsRequest = {
  type: `${EquipmentsTypes}`;
} & {
  latitude?: number;
  longitude?: number;
  distance?: number;
};

export type FetchAllRequest = {
  equipmentId?: number;
  idOrgan?: number;
  idType?: number;
  name?: string;
  enabled?: boolean;
  only_with_measurements?: string;
} & IPaginationInput;

export type UpdateEquipmentRequest = {
  id: number;
  Enable: boolean;
} & UserOperationControllerDTO;
