import {
  IPaginationInput,
  IOutputWithPagination,
} from "./../../helpers/pagination";

import { PluviometerReadEntity } from "../../../entities/equipments/PluviometerRead";
import { StationReadEntity } from "../../../entities/equipments/StationRead";
import { UserCommandOperationProps } from "../../../../modules/Logs/protocols/logger";
// import { IOuputWithPagination } from "./dto/output";
export namespace IEquipsMeasurementsRepoDTO {
  export namespace GetStations {
    export type Params = {
      idEquipment: number;
      time?: {
        start: string;
        end: string | null;
      } | null;
    } & IPaginationInput;
    export type Result = Promise<IOutputWithPagination<StationReadEntity>>;
  }
  export namespace GetLatestStationMeasurements {
    export type Params = {
      id: number;
    };
    export type Result = Promise<StationReadEntity | null>;
  }

  export namespace GetLatestPluviometerMeasurements {
    export type Params = {
      id: number;
    };

    export type Result = Promise<PluviometerReadEntity | null>;
  }
  export namespace CheckIfMeasurementsExists {
    export type Params = {
      id: number;
    };

    export type Result = Promise<boolean>;
  }
  export namespace CheckIfStationMeasureTimeAlreadyExists {
    export type Params = {
      idRead: number;
      time: string;
    };
    export type Result = Promise<boolean>;
  }
  export namespace CheckIfStationMeasurementsAlreadyExists {
    export type Result = Promise<boolean>;
  }
  export namespace CheckIfPluviometerMeasureTimeAlreadyExists {
    export type Params = {
      idRead: number;
      time: string;
    };
    export type Result = Promise<boolean>;
  }
  export namespace GetPluviometers {
    export type Params = {
      idEquipment: number;
      time?: {
        start: string;
        end: string | null;
      } | null;
    } & IPaginationInput;

    export type Result = Promise<IOutputWithPagination<PluviometerReadEntity>>;
  }

  export namespace GetStationMeasurementsById {
    export type Params = number;
    export type Result = Promise<{
      IdRead: number;
      IdEquipment: number;
      Time: string;
      Hour: string | null;
      AverageAtmosphericTemperature: number;
      MinAtmosphericTemperature: number;
      MaxAtmosphericTemperature: number;
      AverageRelativeHumidity: number;
      MaxRelativeHumidity: number;
      MinRelativeHumidity: number;
      AtmosphericPressure: number;
      TotalRadiation: number;
      WindVelocity: number;
    } | null>;
  }
  export namespace GetStationsMeasurementsByIds {
    export type Params = Array<number>;
    export type Result = Promise<Array<{
      IdRead: number;
      Time: string;
      Hour: string | null;
      Altitude: number | null;
      Longitude: number | null;
      Latitude: number | null;
      AverageAtmosphericTemperature: number;
      MinAtmosphericTemperature: number;
      MaxAtmosphericTemperature: number;
      AverageRelativeHumidity: number;
      MaxRelativeHumidity: number;
      MinRelativeHumidity: number;
      AtmosphericPressure: number;
      TotalRadiation: number;
      WindVelocity: number;
    }> | null>;
  }
}

export interface IEquipmentsMeasuresRepository {
  checkIfStationMeasureTimeAlreadyExists(
    params: IEquipsMeasurementsRepoDTO.CheckIfStationMeasureTimeAlreadyExists.Params
  ): IEquipsMeasurementsRepoDTO.CheckIfStationMeasureTimeAlreadyExists.Result;
  checkIfPluviometerMeasureTimeAlreadyExists(
    params: IEquipsMeasurementsRepoDTO.CheckIfPluviometerMeasureTimeAlreadyExists.Params
  ): IEquipsMeasurementsRepoDTO.CheckIfPluviometerMeasureTimeAlreadyExists.Result;
  getLatestStationMeasurements(
    params: IEquipsMeasurementsRepoDTO.GetLatestStationMeasurements.Params
  ): IEquipsMeasurementsRepoDTO.GetLatestStationMeasurements.Result;
  getLatestPluviometerMeasurements(
    params: IEquipsMeasurementsRepoDTO.GetLatestPluviometerMeasurements.Params
  ): IEquipsMeasurementsRepoDTO.GetLatestPluviometerMeasurements.Result;
  getPluviometersReads(
    params: IEquipsMeasurementsRepoDTO.GetPluviometers.Params
  ): IEquipsMeasurementsRepoDTO.GetPluviometers.Result;
  updateStationMeasures(
    measurements: {
      IdRead: number;
      TotalRadiation: number | null;
      AverageRelativeHumidity: number | null;
      MinRelativeHumidity: number | null;
      MaxRelativeHumidity: number | null;
      AverageAtmosphericTemperature: number | null;
      MaxAtmosphericTemperature: number | null;
      MinAtmosphericTemperature: number | null;
      AtmosphericPressure: number | null;
      Et0: number | null;
      WindVelocity: number | null;
    },
    operation: UserCommandOperationProps
  ): Promise<void>;
  updatePluviometerMeasures(
    measurements: {
      IdRead: number;
      Precipitation: number | null;
    },
    operation: UserCommandOperationProps
  ): Promise<void>;
  getStationsMeasurementsByIds(
    ids: IEquipsMeasurementsRepoDTO.GetStationsMeasurementsByIds.Params
  ): IEquipsMeasurementsRepoDTO.GetStationsMeasurementsByIds.Result;
  checkIfStationMeasurementsAlreadyExists(idRead: number): Promise<boolean>;
  getStationsReads(
    params: IEquipsMeasurementsRepoDTO.GetStations.Params
  ): IEquipsMeasurementsRepoDTO.GetStations.Result;
  checkIfPluviometerMeasurementsExists(
    params: IEquipsMeasurementsRepoDTO.CheckIfMeasurementsExists.Params
  ): IEquipsMeasurementsRepoDTO.CheckIfMeasurementsExists.Result;
  getStationMeasurementsById(
    id: IEquipsMeasurementsRepoDTO.GetStationMeasurementsById.Params
  ): IEquipsMeasurementsRepoDTO.GetStationMeasurementsById.Result;
}
