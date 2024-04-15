import {
  EquipmentEntity,
  PluviometerWithLastMeasurement,
  StationWithLastMeasurement,
} from "../../../entities/equipments/Equipment";
import { MeteorologicalOrganEntity } from "../../../entities/equipments/MetereologicalOrgan";
import { PluviometerReadEntity } from "../../../entities/equipments/PluviometerRead";
import { StationReadEntity } from "../../../entities/equipments/StationRead";
import { IInputWithPagination } from "./dto/input";
import { IOuputWithPagination } from "./dto/output";

export namespace MeteorologicalOrganRepositoryDTOProtocol {
  export namespace Get {
    export type Params = void;
    export type Result = Promise<Array<
      Omit<MeteorologicalOrganEntity, "Password">
    > | null>;
  }

  export namespace Create {
    export type Params = Required<Omit<MeteorologicalOrganEntity, "Id">>;
    export type Result = Promise<number | null>;
  }

  export namespace Update {
    export type Params = Required<MeteorologicalOrganEntity>;
    export type Result = Promise<number>;
  }
  export namespace Delete {
    export type Params = Required<MeteorologicalOrganEntity>["Id"];
    export type Result = Promise<number>;
  }

  export namespace CheckIfOrganExists {
    export type Params = number;
    export type Result = Promise<boolean>;
  }
  export namespace CheckIfOrganNameAlreadyExists {
    export type Params = string;
    export type Result = Promise<boolean>;
  }
}
export namespace EquipmentRepositoryDTOProtocol {
  export namespace Create {
    export type Params = {
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
    };

    export type Result = Promise<number | null>;
  }

  export namespace Update {
    export type Params = {
      IdEquipment: number;
      Enable: boolean;
    };
    export type Result = Promise<void>;
  }
  export namespace Delete {
    export type Params = number;
    export type Result = Promise<number>;
  }
  export namespace CheckIfTypeExists {
    export type Params = number;
    export type Result = Promise<boolean>;
  }

  export namespace CheckIfCodeExists {
    export type Params = string;
    export type Result = Promise<boolean>;
  }
  export namespace GetIdByExternalCode {
    export type Params = string;
    export type Result = Promise<number | null>;
  }
  export namespace GetIdBy {
    export type Params = number;
    export type Result = Promise<EquipmentEntity | null>;
  }
  export namespace GetByPageNumber {
    export type Params = {
      idOrgan?: number;
      idType?: number;
      name?: string;
    } & IInputWithPagination;
    export type Result = Promise<IOuputWithPagination<EquipmentEntity>>;
  }
}
export namespace MeasuresRepositoryDTOProtocol {
  export namespace GetStations {
    export type Params = {
      idEquipment: number;
      time?: {
        start: string;
        end: string | null;
      } | null;
    } & IInputWithPagination;
    export type Result = Promise<IOuputWithPagination<StationReadEntity>>;
  }
  export namespace GetStationMeasuresByIdRead {
    export type Params = {
      idRead: number;
    };
    export type Result = Promise<StationReadEntity | null>;
  }
  export namespace CheckIfStationMeasureTimeAlreadyExists {
    export type Params = {
      idRead: number;
      time: string;
    };
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
    } & IInputWithPagination;

    export type Result = Promise<IOuputWithPagination<PluviometerReadEntity>>;
  }
  export namespace GetPluviometersByIdPluviometer {
    export type Params = {
      idRead: number;
    };

    export type Result = Promise<PluviometerReadEntity | null>;
  }
  export namespace UpdateStationMeasures {
    export type Params = {
      IdRead: number;
      Time: string;
      Hour: number | null;
      TotalRadiation: number | null;
      AverageRelativeHumidity: number | null;
      MinRelativeHumidity: number | null;
      MaxRelativeHumidity: number | null;
      AverageAtmosphericTemperature: number | null;
      MaxAtmosphericTemperature: number | null;
      MinAtmosphericTemperature: number | null;
      AtmosphericPressure: number | null;
      ETO: number | null;
      WindVelocity: number | null;
    };

    export type Result = Promise<void>;
  }
  export namespace UpdatePluviometerMeasures {
    export type Params = {
      IdRead: number;
      Time: string;
      Hour: number | null;
      Value: number | null;
    };

    export type Result = Promise<void>;
  }
}

export interface MeteorologicalOrganRepositoryProtocol {
  checkIfOrganNameAlreadyExists(
    organName: MeteorologicalOrganRepositoryDTOProtocol.CheckIfOrganNameAlreadyExists.Params
  ): MeteorologicalOrganRepositoryDTOProtocol.CheckIfOrganNameAlreadyExists.Result;
  checkIfOrganExists(
    idOrgan: MeteorologicalOrganRepositoryDTOProtocol.CheckIfOrganExists.Params
  ): MeteorologicalOrganRepositoryDTOProtocol.CheckIfOrganExists.Result;
  getMeteorologicalOrgans(): MeteorologicalOrganRepositoryDTOProtocol.Get.Result;
  createMeteorologicalOrgan(
    param: MeteorologicalOrganRepositoryDTOProtocol.Create.Params
  ): MeteorologicalOrganRepositoryDTOProtocol.Create.Result;
  updateMeteorologicalOrgan(
    params: MeteorologicalOrganRepositoryDTOProtocol.Update.Params
  ): MeteorologicalOrganRepositoryDTOProtocol.Update.Result;
  deleteMeteorologicalOrgan(
    params: MeteorologicalOrganRepositoryDTOProtocol.Delete.Params
  ): MeteorologicalOrganRepositoryDTOProtocol.Delete.Result;
}
export interface EquipmentsMeasuresRepositoryProtocol {
  getStationsReads(
    params: MeasuresRepositoryDTOProtocol.GetStations.Params
  ): MeasuresRepositoryDTOProtocol.GetStations.Result;
  checkIfStationMeasureTimeAlreadyExists(
    params: MeasuresRepositoryDTOProtocol.CheckIfStationMeasureTimeAlreadyExists.Params
  ): MeasuresRepositoryDTOProtocol.CheckIfStationMeasureTimeAlreadyExists.Result;
  checkIfPluviometerMeasureTimeAlreadyExists(
    params: MeasuresRepositoryDTOProtocol.CheckIfPluviometerMeasureTimeAlreadyExists.Params
  ): MeasuresRepositoryDTOProtocol.CheckIfPluviometerMeasureTimeAlreadyExists.Result;
  getStationReadsByIdRead(
    params: MeasuresRepositoryDTOProtocol.GetStationMeasuresByIdRead.Params
  ): MeasuresRepositoryDTOProtocol.GetStationMeasuresByIdRead.Result;
  getPluviometerReadsByIdRead(
    params: MeasuresRepositoryDTOProtocol.GetPluviometersByIdPluviometer.Params
  ): MeasuresRepositoryDTOProtocol.GetPluviometersByIdPluviometer.Result;
  getPluviometersReads(
    params: MeasuresRepositoryDTOProtocol.GetPluviometers.Params
  ): MeasuresRepositoryDTOProtocol.GetPluviometers.Result;
  updateStationMeasures(
    request: MeasuresRepositoryDTOProtocol.UpdateStationMeasures.Params
  ): MeasuresRepositoryDTOProtocol.UpdateStationMeasures.Result;
  updatePluviometerMeasures(
    request: MeasuresRepositoryDTOProtocol.UpdatePluviometerMeasures.Params
  ): MeasuresRepositoryDTOProtocol.UpdatePluviometerMeasures.Result;
}

export interface EquipmentsRepositoryProtocol
  extends MeteorologicalOrganRepositoryProtocol {
  createEquipment(
    equipment: EquipmentRepositoryDTOProtocol.Create.Params
  ): EquipmentRepositoryDTOProtocol.Create.Result;
  updateEquipment(
    equipment: EquipmentRepositoryDTOProtocol.Update.Params
  ): EquipmentRepositoryDTOProtocol.Update.Result;
  deleteEquipment(
    idEquipment: EquipmentRepositoryDTOProtocol.Delete.Params
  ): EquipmentRepositoryDTOProtocol.Delete.Result;
  checkIfEquipmentCodeAlreadyExists(
    idEquipmentExternal: EquipmentRepositoryDTOProtocol.CheckIfCodeExists.Params
  ): EquipmentRepositoryDTOProtocol.CheckIfCodeExists.Result;
  checkIfEquipmentTypeExists(
    idType: EquipmentRepositoryDTOProtocol.CheckIfTypeExists.Params
  ): EquipmentRepositoryDTOProtocol.CheckIfTypeExists.Result;
  checkIfEquipmentIdExists(id: number): Promise<boolean>;
  getEquipmentIdByExternalCode(
    idEquipmentExternal: EquipmentRepositoryDTOProtocol.GetIdByExternalCode.Params
  ): Promise<number | null>;
  getEquipments(
    pageNumber: EquipmentRepositoryDTOProtocol.GetByPageNumber.Params
  ): EquipmentRepositoryDTOProtocol.GetByPageNumber.Result;
  getEquipmentId(
    id: EquipmentRepositoryDTOProtocol.GetIdBy.Params
  ): EquipmentRepositoryDTOProtocol.GetIdBy.Result;
  getPluviometersWithLastMeasurements(
    params: {
      latitude: number;
      longitude: number;
      distance: number;
    } | null
  ): Promise<Array<PluviometerWithLastMeasurement> | null>;
  getStationsWithLastMeasurements(
    params: {
      latitude: number;
      longitude: number;
      distance: number;
    } | null
  ): Promise<Array<StationWithLastMeasurement> | null>;
}
