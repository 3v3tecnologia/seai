import { EquipmentEntity } from "../../../entities/equipments/Equipment";
import { MeteorologicalOrganEntity } from "../../../entities/equipments/MetereologicalOrgan";
import { PluviometerReadEntity } from "../../../entities/equipments/PluviometerRead";
import { StationReadEntity } from "../../../entities/equipments/StationRead";

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
    };

    export type Result = Promise<number | null>;
  }

  export namespace Update {
    export type Params = Create.Params & {
      IdEquipment: number;
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
  export namespace GetByPageNumber {
    export type Params = {
      pageNumber: number;
      limit: number;
      idOrgan?: number;
      idType?: number;
      name?: string;
    };
    export type Result = Promise<{
      count: number;
      data: Promise<Array<EquipmentEntity> | null>;
    } | null>;
  }
}
export namespace MeasuresRepositoryDTOProtocol {
  export namespace GetStations {
    export type Params = {
      idEquipment: number;
      pageNumber: number;
      limit: number;
      time: {
        start: string;
        end: string | null;
      } | null;
    };
    export type Result = Promise<{
      count: number;
      data: Array<StationReadEntity> | null;
    } | null>;
  }
  export namespace GetPluviometers {
    export type Params = {
      idEquipment: number;
      pageNumber: number;
      limit: number;
      time: {
        start: string;
        end: string | null;
      } | null;
    };

    export type Result = Promise<{
      count: number;
      data: Array<PluviometerReadEntity> | null;
    } | null>;
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
  getPluviometersReads(
    params: MeasuresRepositoryDTOProtocol.GetPluviometers.Params
  ): MeasuresRepositoryDTOProtocol.GetPluviometers.Result;
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
  getEquipmentIdByExternalCode(
    idEquipmentExternal: EquipmentRepositoryDTOProtocol.GetIdByExternalCode.Params
  ): Promise<number | null>;
  getEquipments(
    pageNumber: EquipmentRepositoryDTOProtocol.GetByPageNumber.Params
  ): EquipmentRepositoryDTOProtocol.GetByPageNumber.Result;
}
