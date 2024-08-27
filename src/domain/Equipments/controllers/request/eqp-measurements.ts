import { UserOperationControllerDTO } from "../../../../@types/login-user";
import { IPaginationInput } from "../../../../shared/utils/pagination";
import { EquipmentsTypes } from "../../core/models/equipments-types";

export type getByEquipmentsCodesAndDateRequest = {
  codes: Array<string>;
  date: string;
  type: `${EquipmentsTypes}`;
};

export type bulkInsertEquipmentsRequest = {
  type: `${EquipmentsTypes}`;
  items: Array<any>;
  id_organ: number;
  date: string;
};

export type fetchLatestRequest = {
  id: number;
  type: `${EquipmentsTypes}`;
};

export type fetchByPluviometerRequest = {
  idEquipment: number;
  start?: string;
  end?: string | null;
} & IPaginationInput;

export type fetchByStationRequest = {
  idEquipment: number;
  start?: string;
  end?: string | null;
} & IPaginationInput;

export type updateByStationRequest = {
  id: number;
  TotalRadiation: number | null;
  AverageRelativeHumidity: number | null;
  MinRelativeHumidity: number | null;
  MaxRelativeHumidity: number | null;
  AverageAtmosphericTemperature: number | null;
  MaxAtmosphericTemperature: number | null;
  MinAtmosphericTemperature: number | null;
  AtmosphericPressure: number | null;
  WindVelocity: number | null;
} & UserOperationControllerDTO;

export type updateByPluviometerRequest = {
  id: number;
  Precipitation: number | null;
} & UserOperationControllerDTO;
