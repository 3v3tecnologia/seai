import { UserOperationControllerDTO } from "../../../../@types/login-user";
import { IPaginationInput } from "../../../../shared/utils/pagination";
import { EquipmentsTypes } from "../../core/models/equipments-types";

export type getAllEquipmentsRequest = {
  type: `${EquipmentsTypes}`;
};

export type bulkInsertRequest = {
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

export type getMeteorologicalOrganAccessCredentialRequest = {
  organName: string;
};

export type createEquipmentRequest = {
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

export type fetchEquipmentsWithYesterDayMeasurementsRequest = {
  type: `${EquipmentsTypes}`;
} & {
  latitude?: number;
  longitude?: number;
  distance?: number;
};

export type fetchAllRequest = {
  equipmentId?: number;
  idOrgan?: number;
  idType?: number;
  name?: string;
  enabled?: boolean;
  only_with_measurements?: string;
} & IPaginationInput;

export type updateEquipmentRequest = {
  id: number;
  Enable: boolean;
} & UserOperationControllerDTO;
