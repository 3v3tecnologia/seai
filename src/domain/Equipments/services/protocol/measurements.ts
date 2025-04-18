import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../../shared/utils/pagination";
import { Either } from "../../../../shared/Either";
import { UserCommandOperationProps } from "../../../Logs/core/protocols/logger";
import { PluviometerReadEntity } from "../../core/models/PluviometerRead";
import { StationReadEntity } from "../../core/models/StationRead";
import { AuditableInput } from "../../../../shared/utils/command";

export interface IEquipmentsMeasurementsServices {
  getByEquipmentsCodesAndDate(
    eqpType: "station" | "pluviometer",
    codes: Array<string>,
    date: string
  ): Promise<Either<Error, Array<string>>>;

  bulkInsert(params: {
    type: "station" | "pluviometer";
    date: string;
    items: Array<any>;
    id_organ: number;
  }): Promise<Either<Error, string>>;
  fetchLatest(request: {
    id: number;
    type: "station" | "pluviometer";
  }): Promise<Either<Error, StationReadEntity | PluviometerReadEntity | null>>;
  fetchByPluviometer(
    request: {
      idEquipment: number;
      start?: string | null;
      end?: string | null;
    } & IPaginationInput
  ): Promise<
    Either<Error, IOutputWithPagination<PluviometerReadEntity> | null>
  >;
  fetchByStation(
    request: {
      idEquipment: number;
      time?: {
        start: string;
        end: string | null;
      } | null;
    } & IPaginationInput
  ): Promise<Either<Error, IOutputWithPagination<StationReadEntity> | null>>;
  updateByPluviometer(
    { audit, data }: AuditableInput<{
      IdRead: number;
      Precipitation: number | null;
    }>): Promise<Either<Error, string>>
  updateByStation(
    { audit, data }: AuditableInput<{
      IdRead: number;
      TotalRadiation: number | null;
      AverageRelativeHumidity: number | null;
      MinRelativeHumidity: number | null;
      MaxRelativeHumidity: number | null;
      AverageAtmosphericTemperature: number | null;
      MaxAtmosphericTemperature: number | null;
      MinAtmosphericTemperature: number | null;
      AtmosphericPressure: number | null;
      WindVelocity: number | null;
    }>): Promise<Either<Error, string>>
}
